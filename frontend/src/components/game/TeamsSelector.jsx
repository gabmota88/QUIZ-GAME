import { useEffect, useState } from "react";
import { getTeams } from "../../services/teamService";

export default function TeamsSelector() {

  const [teams, setTeams] = useState([]);

  useEffect(() => {

    async function loadTeams() {

      const data =
        await getTeams();

      setTeams(data);
    }

    loadTeams();

  }, []);

  return (

    <div className="grid grid-cols-3 gap-4">

      {teams.map(team => (

        <div
          key={team.id}
          className="
            bg-zinc-800
            p-4
            rounded-xl
            text-center
          "
        >

          <div className="text-5xl">

            {team.avatar}

          </div>

          <h2>

            {team.nome}

          </h2>

        </div>

      ))}

    </div>

  );
}