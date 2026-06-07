const COLORS = [
  "#fa0909",
  "#0a4fbe",
  "#005720",
  "#eeff04",
  "#350264",
  "#ff6b01",
  "#ec4899",
  "#2175d4",
  "#505357",
  "#9898a4",
  "#e4c083",
  "#d4ff95",
  "#7effd4",
  "#7dfff0",
  "#88d9ff",
  "#a4a6ff",
  "#bfa4ff",
  "#dd00ff",
  "#ff01c4",
  "#4b7ee3"
];

export default function ColorPicker({
  selected,
  onSelect
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      {COLORS.map((cor) => (
        <button
          key={cor}
          type="button"
          onClick={() => onSelect(cor)}
          className={`
            w-10 h-10 rounded-full border-4
            ${
              selected === cor
                ? "border-white"
                : "border-transparent"
            }
          `}
          style={{
            backgroundColor: cor
          }}
        />
      ))}
    </div>
  );
}