import TeamCard from "./TeamCard";

export default function TeamList({
  equipes,
  onDelete
}) {

  if (equipes.length === 0) {

    return (

      <div
        className="
          text-zinc-400
        "
      >
        Nenhuma equipe cadastrada.
      </div>

    );
  }

  return (

    <div
      className="
        grid
        gap-4
      "
    >

      {equipes.map(
        (equipe) => (

          <TeamCard
            key={equipe.id}
            equipe={equipe}
            onDelete={onDelete}
          />

        )
      )}

    </div>

  );
}