export default function DificuldadeSelector({
  onSelect,
}) {
  return (
    <div className="grid grid-cols-3 gap-4">

      <button
        onClick={() => onSelect("facil")}
        className="bg-[#39FF14] text-black p-2 text-x2 font-bold rounded-xl hover:opacity-80 transition shadow-[0_0_15px_#39FF14]"
      >
        Fácil
      </button>

      <button
        onClick={() => onSelect("medio")}
        className="bg-[#CCFF00] text-black p-2 text-x2 font-bold rounded-xl hover:opacity-80 transition shadow-[0_0_15px_#CCFF00]"
      >
        Médio
      </button>

      <button
        onClick={() => onSelect("dificil")}
        className="bg-[#FF3131] text-black p-2 text-x2 font-bold rounded-xl hover:opacity-80 transition shadow-[0_0_15px_#FF3131]"
      >
        Difícil
      </button>

    </div>
  );
}