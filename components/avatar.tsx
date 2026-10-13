import { initials } from "../lib/labs";

const tints = ["#e3f0e8", "#e6eee9", "#e9f1e4"];

export default function Avatar({ name, photoUrl, index = 0, className = "", textClassName = "text-5xl" }: {
  name: string;
  photoUrl?: string;
  index?: number;
  className?: string;
  textClassName?: string;
}) {
  return (
    <div
      className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden ring-1 ring-inset ring-forest/10 ${className}`}
      style={{ background: tints[index % tints.length] }}
    >
      {photoUrl ? (
        // Photos can be hosted anywhere, so a plain img avoids configuring next/image remote domains.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={name} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span aria-hidden className={`absolute inset-0 flex items-center justify-center font-display font-normal text-forest/80 ${textClassName}`}>
          {initials(name)}
        </span>
      )}
    </div>
  );
}
