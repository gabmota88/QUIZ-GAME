import { useState, useEffect } from "react";

import GameHeader from "../components/game/GameHeader";
import GameControls from "../components/game/GameControls";
import QuestionCard from "../components/game/QuestionCard";
import TimerCircle from "../components/game/TimerCircle";
import TeamSelector from "../components/game/TeamSelector";
import DificuldadeSelector from "../components/game/DificuldadeSelector";


import {
  listarCategorias
} from "../services/categoryService";

import {
  getTeams,
  sortearOrdemEquipes
}
from "../services/teamService";

import {
  iniciarPartida
}
from "../services/gameService";

import {
  buscarPergunta
,
  responderPergunta
}
from "../services/questionsService"




export default function Game() {

  const [categorias, setCategorias] =
    useState([]);

  const [equipes, setEquipes] =
    useState([]);

  const [ordemJogo, setOrdemJogo] =
    useState([]);

  const [equipeAtual, setEquipeAtual] =
    useState(null);

  const [ordemEquipes, setOrdemEquipes] =
  useState([]);  

  const [partidaIniciada, setPartidaIniciada] =
    useState(false);


  const [categoriaSelecionada,
       setCategoriaSelecionada] =
    useState(null);

   const [dificuldadeSelecionada,
       setDificuldadeSelecionada] =
     useState(null);


   const [perguntaAtual,
     setPerguntaAtual] =
    useState(null);
    
     const [respostaJogador,
          setRespostaJogador] =
      useState("");

    const [resultadoResposta,
           setResultadoResposta] =
       useState(null);


  useEffect(() => {

    async function carregarCategorias() {

      try {

        const dados =
          await listarCategorias();

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

  async function sortearOrdem() {

  try {

    const equipesSorteadas =
      await sortearOrdemEquipes();

    setOrdemEquipes(
      equipesSorteadas
    );

    setEquipeAtual(
      equipesSorteadas[0]
    );

    console.log(
      "Ordem sorteada:",
      equipesSorteadas
    );

  } catch (erro) {

    console.error(
      erro
    );

    alert(
      "Erro ao sortear equipes."
    );

  }

}

async function carregarPergunta() {

  if (
    !categoriaSelecionada ||
    !dificuldadeSelecionada
  ) return;

  try {

    const pergunta =
      await buscarPergunta(
        categoriaSelecionada.id,
        dificuldadeSelecionada
      );

    console.log(
      "Pergunta:",
      pergunta
    );

    setPerguntaAtual(
      pergunta
    );

  } catch (erro) {

    console.error(
      erro
    );

  }

}

  useEffect(() => {
    if (categoriaSelecionada && dificuldadeSelecionada) {
      carregarPergunta();
    }
  }, [categoriaSelecionada, dificuldadeSelecionada]);

async function enviarResposta() {

  try {

    const resultado =
      await responderPergunta(

        equipeAtual.id,

        perguntaAtual.id,

        respostaJogador

      );

    console.log(
      resultado
    );

    setResultadoResposta(
      resultado
    );

  } catch (erro) {

    console.error(
      erro
    );

    alert(
      "Erro ao responder."
    );

  }

}









  return (
    <div className="space-y-8">
      {/* 1. BOTÕES DE CONTROLE (Acima da rodada) */}
      <GameControls
        onSortearOrdem={sortearOrdem}
        onIniciarJogo={async () => {
          try {
            const partida = await iniciarPartida();
            console.log("Partida criada:", partida);
            setPartidaIniciada(true);
          } catch (erro) {
            console.error(erro);
            alert("Erro ao iniciar partida.");
          }
        }}
        onFinalizarJogo={() => {
          setPartidaIniciada(false);
          console.log("Partida finalizada");
        }}
        onZerarPlacar={() => console.log("Zerar placar")}
      />

      {/* 2. HEADER (Texto da Rodada) */}
      <GameHeader />

      {/* 3. ONDE APARECE A EQUIPE ATUAL */}
      {equipeAtual && (
        <div className="bg-zinc-900 rounded-2xl p-6 flex items-center gap-6 border border-zinc-800 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <img 
            src={equipeAtual.avatar} 
            alt={equipeAtual.nome} 
            className="w-24 h-24 rounded-full border-4" 
            style={{ borderColor: equipeAtual.cor, boxShadow: `0 0 15px ${equipeAtual.cor}` }} 
          />
          <div>
            <p className="text-zinc-400">Equipe Atual</p>
            <h2 className="text-3xl font-black">{equipeAtual.nome}</h2>
          </div>
        </div>
      )}

      {/* 4. AS EQUIPES */}
      <TeamSelector equipes={equipes} />

      {/* 5. CATEGORIA SELECIONADA */}
      {categoriaSelecionada && (
        <div className="bg-[#00D4FF]/10 border border-[#00D4FF] p-4 rounded-xl text-xl shadow-[0_0_10px_rgba(0,212,255,0.2)]">
          Categoria selecionada: <strong className="text-[#00D4FF] uppercase">{categoriaSelecionada.nome}</strong>
        </div>
      )}

      {/* 6. AS CATEGORIAS (Estilizadas fluorescentes) */}
      <div className="grid grid-cols-4 gap-4">
        {categorias.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              setCategoriaSelecionada(cat);
              console.log("Categoria:", cat.nome);
            }}
            className="bg-[#00D4FF] text-black p-6 text-center font-bold rounded-xl cursor-pointer hover:opacity-80 transition shadow-[0_0_15px_#00D4FF]"
          >
            {cat.nome}
          </div>
            ))}
      </div>
        {/* 7. DIFICULDADE */}

<DificuldadeSelector

  onSelect={(nivel) => {

    if (!partidaIniciada) {

      alert(
        "Inicie a partida primeiro."
      );

      return;

    }

    if (!categoriaSelecionada) {

      alert(
        "Selecione uma categoria primeiro."
      );

      return;

    }

    setDificuldadeSelecionada(
      nivel
    );

    console.log(
      "Dificuldade:",
      nivel
    );

  }}

/>


{/* 8. PERGUNTA */}

<QuestionCard
  pergunta={perguntaAtual}
/>


{/* 9. CAMPO DE RESPOSTA */}

{perguntaAtual && (

  <div
    className="
      bg-zinc-900
      rounded-xl
      p-6
      space-y-4
    "
  >

    <input

      type="text"

      placeholder="Digite sua resposta"

      value={respostaJogador}

      onChange={(e) =>
        setRespostaJogador(
          e.target.value
        )
      }

      className="
        w-full
        p-4
        rounded-xl
        bg-zinc-800
        border
        border-zinc-700
      "
    />

    <button

      onClick={enviarResposta}

      className="
        w-full
        p-4
        rounded-xl

        bg-green-500
        hover:bg-green-400

        text-black
        font-black

        shadow-lg
        shadow-green-500/50
      "

    >

      RESPONDER

    </button>

  </div>

)}


{/* 10. RESULTADO */}

{resultadoResposta && (

  <div

    className={`
      p-6
      rounded-xl
      text-center
      font-black
      text-xl

      ${
        resultadoResposta.correto
          ? "bg-green-700"
          : "bg-red-700"
      }
    `}

  >

    {

      resultadoResposta.correto

        ? "✅ RESPOSTA CORRETA"

        : "❌ RESPOSTA INCORRETA"

    }

  </div>

)}


{/* 11. TIMER */}

<TimerCircle />



        
      </div>)}
    