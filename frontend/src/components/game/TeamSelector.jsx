export default function TeamSelector({
  equipes = []
}) {
  return (

    <div
      className="
        grid
        md:grid-cols-3
        gap-4
      "
    >

      {equipes.map(
        (equipe) => (

          <div
            key={equipe.id}
            className="
              bg-zinc-800
              p-4
              rounded-xl
            "
          >

            <img
              src={equipe.avatar}
              alt=""
              className="
                w-16
                h-16
                rounded-full
              "
            />

            <h3>
              {equipe.nome}
            </h3>

          </div>

        )
      )}

    </div>

  );

}

