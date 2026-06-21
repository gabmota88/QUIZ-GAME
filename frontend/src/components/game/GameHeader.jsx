export default function GameHeader({
  rodada
}) {

  return (

    <div
      className="
        bg-zinc-900
        rounded-4xl
        p-1
        text-center
      "
    >

      <h2
        className="
          text-4xl
          font-black
        "
      >
        🎮 Rodada {rodada}
      </h2>

    </div>

  );

}