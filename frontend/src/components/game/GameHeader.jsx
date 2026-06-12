export default function GameHeader({
  rodada
}) {

  return (

    <div
      className="
        bg-zinc-900
        rounded-2xl
        p-6
        text-center
      "
    >

      <h1
        className="
          text-5xl
          font-black
        "
      >
        🎮 Rodada {rodada}
      </h1>

    </div>

  );

}