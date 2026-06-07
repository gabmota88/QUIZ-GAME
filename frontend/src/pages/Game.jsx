import { useState, useEffect } from "react";

import GameHeader from "../components/game/GameHeader";
import GameControls from "../components/game/GameControls";
import QuestionCard from "../components/game/QuestionCard";
import TimerCircle from "../components/game/TimerCircle";

import CategoriasDebug from "../components/game/CategoriasDebug";

import {
  listarCategorias
} from "../services/categoryService";

export default function Game() {

  const [categorias, setCategorias] =
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

  return (

    <div className="space-y-8">

      <GameHeader />

<div className="bg-zinc-900 p-4 rounded">

  <h2>
    Categorias carregadas:
  </h2>

  {categorias.map(cat => (

    <div key={cat.id}>

      {cat.nome}

    </div>

  ))}

</div>



      <GameControls />

      <QuestionCard />

      <TimerCircle />

      <CategoriasDebug
        categorias={categorias}
      />

    </div>

  );

}