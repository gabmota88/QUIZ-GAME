export default function TeamCard({
  equipe,
  onDelete
}) {

  return (

    <div
      className="
        bg-zinc-800
        p-4
        rounded
      "
    >

      <h3>
        {equipe.nome}
      </h3>

      <p>
        Cor: {equipe.cor}
      </p>

      <p>
        Pontos: {equipe.pontos}
      </p>

      <button
        onClick={() =>
          onDelete(equipe.id)
        }
        className="
          bg-red-600
          px-3
          py-1
          rounded
          mt-2
        "
      >
        Excluir
      </button>

    </div>
  );
}