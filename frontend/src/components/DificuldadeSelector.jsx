export default function DificuldadeSelector({
  onSelect,
}) {
  return (
    <div className="flex gap-4 justify-center">

      <button
        onClick={() => onSelect("facil")}
        className="
          px-8 py-4
          bg-green-600
          rounded-xl
          text-xl
          font-bold
        "
      >
        Fácil
      </button>

      <button
        onClick={() => onSelect("medio")}
        className="
          px-8 py-4
          bg-orange-500
          rounded-xl
          text-xl
          font-bold
        "
      >
        Médio
      </button>

      <button
        onClick={() => onSelect("dificil")}
        className="
          px-8 py-4
          bg-red-600
          rounded-xl
          text-xl
          font-bold
        "
      >
        Difícil
      </button>

    </div>
  );
}