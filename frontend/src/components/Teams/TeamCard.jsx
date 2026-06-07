export default function TeamCard({
  equipe,
  onDelete
}) {

  return (

    <div
 
  className="
    bg-zinc-900
    rounded-xl
    overflow-hidden
  "
>
  <div
    style={{
      backgroundColor: equipe.cor
    }}
    className="h-3"
  />

  <div className="p-4">

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <img
          src={equipe.avatar}
          alt={equipe.nome}
          className="
            w-20
            h-20
            rounded-full
            border-4
            border-white
          "
        />

        <div>

          <h3
            className="
              text-xl
              font-bold
            "
          >
            {equipe.nome}
          </h3>

        </div>

      </div>

      <button
        onClick={() =>
          onDelete(equipe.id)
        }
        className="
          mt-4
          bg-black/30
          hover:bg-black/50
          px-3
          py-2
          rounded
        "
      >
        Excluir
      </button>

    </div>

  );
}