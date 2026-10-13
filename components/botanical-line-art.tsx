// Fine-line botanical motif used in the hero and on lab cards.
export default function BotanicalLineArt({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 400" preserveAspectRatio="xMidYMax meet" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <g strokeWidth="1.3" strokeOpacity=".9">
        <path d="M160 400C158 320 150 240 168 120" />
        <path d="M158 305Q95 312 64 255Q128 242 158 305Z" />
        <path d="M158 305Q112 280 64 255" />
        <path d="M157 255Q220 270 258 214Q194 198 157 255Z" />
        <path d="M157 255Q208 238 258 214" />
        <path d="M156 205Q94 206 76 142Q140 140 156 205Z" />
        <path d="M156 205Q118 175 76 142" />
        <path d="M161 165Q218 176 240 108Q182 102 161 165Z" />
        <path d="M161 165Q202 140 240 108" />
        <path d="M168 120Q143 92 170 52Q193 92 168 120Z" />
        <path d="M168 120V60" />
      </g>
      <g strokeWidth=".9" strokeOpacity=".45">
        <path d="M128 291l-12-22M110 284l-14-21M196 254l8-20M219 245l9-19M120 186l-10-22M104 178l-12-20M200 151l6-21M221 139l6-18" />
      </g>
      <g strokeWidth="1" strokeOpacity=".4">
        <path d="M74 64l18 10v21l-18 10-18-10V74z" />
        <path d="M92 74l18-10 18 10M110 64V44" />
      </g>
      <g fill="currentColor" stroke="none" fillOpacity=".55">
        <circle cx="74" cy="64" r="2.4" /><circle cx="92" cy="74" r="2.4" /><circle cx="92" cy="95" r="2.4" />
        <circle cx="74" cy="105" r="2.4" /><circle cx="56" cy="95" r="2.4" /><circle cx="56" cy="74" r="2.4" />
        <circle cx="110" cy="64" r="2.4" /><circle cx="128" cy="74" r="2.4" /><circle cx="110" cy="44" r="2.4" />
      </g>
    </svg>
  );
}
