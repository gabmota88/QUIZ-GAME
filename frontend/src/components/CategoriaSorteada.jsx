export default function CategoriaSorteada({
  categoria,
}) {

  if (!categoria) return null;

  return (

    <div
      className="
        mt-8
        text-center
      "
    >

      <p
        className="
          text-zinc-400
          text-lg
        "
      >
        Categoria sorteada
      </p>

      <h2
        className="
          text-5xl
          font-black
          text-yellow-400
          mt-2
        "
      >
        {categoria}
      </h2>

    </div>

  );
}