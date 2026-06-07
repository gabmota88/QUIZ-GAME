import { useState, useEffect } from "react";

import GameHeader from "../components/game/GameHeader";
import GameControls from "../components/game/GameControls";
import QuestionCard from "../components/game/QuestionCard";
import TimerCircle from "../components/game/TimerCircle";
import TeamSelector from "../components/game/TeamSelector";
import DificuldadeSelector from "../components/game/DificuldadeSelector";


import CategoriasDebug from "../components/game/CategoriasDebug";

import {
  listarCategorias
} from "../services/categoryService";

import {
  getTeams} 
from "../services/teamService";


export default function Game() {

  const [categorias, setCategorias] =
    useState([]);

  const [equipes, setEquipes] =
    useState([]);
  

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const dados = await listarCategorias();
        setCategorias(dados);
      } catch (erro) {
        console.error(erro);
      }
    }

    carregarCategorias();
  }, []);

  useEffect(() => {
    async function carregarEquipes() {

      try {

        const dados =
          await getTeams();

        setEquipes(dados);

        console.log(
          "Equipes:",
          dados
        );

      } catch (erro) {

        console.error(
          erro
        );

      }

    }

    carregarEquipes();
  }, []);

  return (

    <div className="space-y-8">

      <GameHeader />

<div className="grid grid-cols-4 gap-4">
  {categorias.map((cat) => (
    <div
      key={cat.id}
      className="
        bg-zinc-800
        hover:bg-gray-500
        hover:text-black
        rounded-x1
        p-6
        text-center
        font-bold
        cursor-pointer
        transition
      "
    >
      {cat.nome}
    </div>
  ))}
</div>



      <GameControls />

      <TeamSelector
        equipes={equipes}
      />

      <QuestionCard />

      <TimerCircle />

      <DificuldadeSelector/>

      <CategoriasDebug
        categorias={categorias}
      />

    </div>

  );

}