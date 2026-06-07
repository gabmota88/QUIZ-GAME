import TeamCard from "./TeamCard";

export default function TeamList({
  equipes,
  onDelete
}) {

  return (

    <div className="grid gap-4">

      {equipes.map((equipe) => (

        <TeamCard
          key={equipe.id}
          equipe={equipe}
          onDelete={onDelete}
        />

      ))}

    </div>
  );
}