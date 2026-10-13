import Link from "next/link";
import type { GardenPlant } from "../lib/garden";
import BotanicalLineArt from "./botanical-line-art";
import ShareButton from "./share-button";

const roundButton = "flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-forest shadow-sm transition-transform hover:scale-110";

const badgeColors = ["#2e8b57", "#7a4fc9", "#b8860b", "#16897a", "#cc3d6a", "#d4622a", "#2f6bc9", "#8d44b8"];

// The same category always gets the same badge colour.
export function categoryColor(category: string) {
  let hash = 0;
  for (const char of category) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return badgeColors[hash % badgeColors.length];
}

export function PlantPhoto({ plant, className = "", flip = false }: { plant: GardenPlant; className?: string; flip?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-[linear-gradient(160deg,#e7f1ea,#d3e6da)] ${className}`}>
      {plant.photo_url ? (
        // Photos can be hosted anywhere, so a plain img avoids configuring next/image remote domains.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={plant.photo_url} alt={plant.common_name || plant.botanical_name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <BotanicalLineArt className={`absolute -bottom-3 h-[118%] text-forest/30 ${flip ? "left-[10%] -scale-x-100" : "right-[10%]"}`} />
      )}
    </div>
  );
}

const icons = {
  uses: <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14m0 0 7-7" />,
  family: <path d="M12 12v9m0-9c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 0c3 0 5-2 5-5-3 0-5 2-5 5Zm0 0c0-3-1.5-5.5-3.5-7M12 12c0-3 1.5-5.5 3.5-7" />,
  research: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9" />,
  parts: <path d="M12 21V9m0 0C12 5 9 3 5 3c0 4 3 6 7 6Zm0 4c0-3 2.5-5 7-5 0 3.5-3 5-7 5Z" />,
};

function Detail({ icon, label, children }: { icon: keyof typeof icons; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-leaf-dark" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {icons[icon]}
      </svg>
      <p className="text-[13.5px] leading-snug text-moss">
        <span className="font-semibold text-ink">{label}:</span> {children}
      </p>
    </div>
  );
}

export default function PlantCard({ plant, index = 0, saved, onToggleSave }: {
  plant: GardenPlant;
  index?: number;
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  const name = plant.common_name || plant.botanical_name;
  const research = plant.research_notes || (plant.lab ? `Studied in the ${plant.lab.name}` : "");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(6,48,31,.06),0_8px_24px_-12px_rgba(6,48,31,.18)] ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(6,48,31,.06),0_22px_40px_-16px_rgba(6,48,31,.3)]">
      <div className="relative p-2 pb-0">
        <PlantPhoto plant={plant} flip={index % 2 === 1} className="aspect-[16/10] rounded-xl [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-105" />
        {plant.category && (
          <span className="absolute left-5 top-5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm" style={{ background: categoryColor(plant.category) }}>
            {plant.category}
          </span>
        )}
        <div className="absolute right-5 top-5 flex gap-2">
          {onToggleSave && (
            <button
              type="button"
              onClick={onToggleSave}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${name} from saved plants` : `Save ${name}`}
              className={roundButton}
            >
              <svg aria-hidden viewBox="0 0 24 24" className={`h-[18px] w-[18px] ${saved ? "fill-[#cc3d6a] text-[#cc3d6a]" : "fill-none"}`} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z" />
              </svg>
            </button>
          )}
          <ShareButton path={`/physicgarden/${plant.slug}`} title={name} text={`${name} (${plant.botanical_name}) in the CPNPDD Physic Garden`} className={roundButton} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="font-display text-[1.4rem] leading-tight text-ink">{name}</h3>
        <p className="mt-0.5 font-display text-[15px] italic text-leaf-dark">{plant.botanical_name}</p>

        <div className="mt-4 space-y-2.5">
          {plant.traditional_uses.length > 0 && <Detail icon="uses" label="Traditional uses">{plant.traditional_uses.join(", ")}</Detail>}
          {plant.family && <Detail icon="family" label="Family">{plant.family}</Detail>}
          {research ? (
            <Detail icon="research" label="Research interest">{research}</Detail>
          ) : (
            plant.parts_used.length > 0 && <Detail icon="parts" label="Parts used">{plant.parts_used.join(", ")}</Detail>
          )}
        </div>

        <div aria-hidden className="min-h-5 flex-1" />
        <Link
          href={`/physicgarden/${plant.slug}`}
          className="group/btn flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-dark"
        >
          View details
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 10h11m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">about {name}</span>
        </Link>
      </div>
    </article>
  );
}
