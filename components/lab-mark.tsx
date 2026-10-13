import BotanicalLineArt from "./botanical-line-art";

const backgrounds = [
  "linear-gradient(160deg, #137a4c 0%, #0a5235 100%)",
  "linear-gradient(160deg, #0e6a52 0%, #06402f 100%)",
  "linear-gradient(160deg, #1a6e3f 0%, #0b4527 100%)",
];

// Decorative panel that stands in for a lab photo.
export default function LabMark({ index = 0, className = "" }: { index?: number; className?: string }) {
  return (
    <div aria-hidden className={`overflow-hidden ${className}`} style={{ background: backgrounds[index % backgrounds.length] }}>
      <div className="absolute inset-0 opacity-[.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:28px_28px]" />
      <BotanicalLineArt
        className="absolute -bottom-[8%] right-[-6%] h-[115%] text-leaf-light/80"
      />
      <span className="absolute bottom-5 left-6 font-display text-6xl font-light tabular-nums text-white/90">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
