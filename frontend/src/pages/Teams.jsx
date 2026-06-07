import { useEffect, useState } from "react";

import TeamForm from "../components/teams/TeamForm";
import TeamList from "../components/teams/TeamList";

import {
  getTeams,
  createTeam,
  deleteTeam
}
from "../services/teamService";

export default function Teams() {

  const [equipes, setEquipes] =
    useState([]);

  useEffect(() => {

    carregarEquipes();

  }, []);

  async function carregarEquipes() {

    const dados =
      await getTeams();

    setEquipes(dados);
  }

  async function criarEquipe(
    novaEquipe
  ) {

    await createTeam(
      novaEquipe
    );

    carregarEquipes();
  }

  async function excluirEquipe(
    id
  ) {

    await deleteTeam(id);

    carregarEquipes();
  }

  return (

    <div className="space-y-8">

      <h1
        className="
          text-4xl
          font-bold
        "
      >
        Equipes
      </h1>

      {
        equipes.length >= 6 && (

          <div
            className="
              p-4
              bg-red-900
              rounded
            "
          >
            Máximo de 6 equipes.
          </div>

        )
      }

      {
        equipes.length < 6 && (

          <TeamForm
            onCreate={criarEquipe}
          />

        )
      }

      <TeamList
        equipes={equipes}
        onDelete={excluirEquipe}
      />

    </div>
  );
}