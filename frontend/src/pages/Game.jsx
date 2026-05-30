import { useState,useEffect } from "react";


import {
  Card,
  CardContent,
} from "../components/ui/card";

import {
  Badge,
} from "../components/ui/badge";

import {
  Button,
} from "../components/ui/button";

import DificuldadeSelector from "../components/DificuldadeSelector";
import CategoriaSorteada from "../components/CategoriaSorteada";

export default function Game() {

  const categorias = [
    "Filmes",
    "Séries",
    "História",
    "Disney",
    "Países",
    "Esportes",
    "One Piece",
  ];

  const [categoria, setCategoria] = useState(null);


  const [dificuldade, setDificuldade] =
  useState("");

const [tempo, setTempo] =
  useState(0);

const [tempoInicial, setTempoInicial] =
  useState(0);

const [timerAtivo, setTimerAtivo] =
  useState(false);


  const [resposta, setResposta] = useState("");

 function escolherDificuldade(nivel) {

  setDificuldade(nivel);

  const categoriaSorteada =
    categorias[
      Math.floor(
        Math.random() *
        categorias.length
      )
    ];

  setCategoria(categoriaSorteada);

  let tempoDefinido = 0;

  if (nivel === "facil") {
    tempoDefinido = 30;
  }

  if (nivel === "medio") {
    tempoDefinido = 20;
  }

  if (nivel === "dificil") {
    tempoDefinido = 10;
  }

  setTempo(tempoDefinido);
  setTempoInicial(tempoDefinido);

  setTimerAtivo(true);
}

useEffect(() => {

  if (!timerAtivo) return;

  const interval = setInterval(() => {

    setTempo((prev) => {

      if (prev <= 1) {

        clearInterval(interval);

        setTimerAtivo(false);

        alert("⏰ Tempo esgotado!");

        return 0;
      }

      return prev - 1;
    });

  }, 1000);

  return () => clearInterval(interval);

}, [timerAtivo]);

const porcentagem =
  tempoInicial > 0
    ? (tempo / tempoInicial) * 100
    : 0;

let corTimer = "#22c55e";

if (porcentagem <= 60) {
  corTimer = "#eab308";
}

if (porcentagem <= 30) {
  corTimer = "#ef4444";
}

  return (
    <div className="space-y-8">

      {/* CONTROLES */}

      <div className="flex flex-wrap gap-4 justify-center">

        <Button className="bg-purple-600">
          🎲 Sortear Ordem
        </Button>

        <Button className="bg-green-600">
          ▶️ Iniciar Jogo
        </Button>

        <Button className="bg-red-600">
          ⏹️ Finalizar
        </Button>

        <Button className="bg-yellow-500 text-black">
          🔄 Zerar Placar
        </Button>

      </div>


      {/* TOPO */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-black">
            Rodada 1
          </h1>

          <p className="text-zinc-400 text-xl mt-2">

            Equipe atual:

            <span className="text-blue-400 font-bold ml-2">
              Azul
            </span>

          </p>

        <div className="flex items-center gap-6">

  <Badge
    className="
      text-2xl
      px-8
      py-4
      bg-yellow-400
      text-black
    "
  >
    10 pontos
  </Badge>

  <div className="relative w-28 h-28">

    <svg
      className="w-28 h-28 -rotate-90"
      viewBox="0 0 100 100"
    >

      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#27272a"
        strokeWidth="8"
        fill="none"
      />

      <circle
        cx="50"
        cy="50"
        r="40"
        stroke={corTimer}
        strokeWidth="8"
        fill="none"
        strokeDasharray="251"
        strokeDashoffset={
          251 -
          (251 * porcentagem) / 100
        }
        strokeLinecap="round"
      />

    </svg>

    <div
      className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        text-3xl
        font-black
      "
    >
      {tempo}
    </div>

  </div>

</div>


      {/* DIFICULDADE */}

      <Card className="bg-zinc-900 border-zinc-800 rounded-3xl">

        <CardContent className="p-8">

          <h2 className="text-3xl font-bold text-center mb-6">
            Escolha a dificuldades
          </h2>

          <DificuldadeSelector
            onSelect={escolherDificuldade}
          />

        </CardContent>

      </Card>


      {/* CATEGORIA */}

      <CategoriaSorteada
        categoria={categoria}
      />

<Card className="bg-zinc-1000 border-zinc-600 rounded-3xl">

  <CardContent className="p-10 space-y-8">

    <h2 className="
      text-2x2
      font-bold
      mb-10
      text-center
    ">
      Escolha a dificuldade
    </h2>

    <div className="
      flex
      justify-center
      gap-4
      flex-wrap
    ">

      <Button
        className="
          bg-green-400
          hover:bg-green-500
        "
        onClick={() =>
          escolherDificuldade("facil")
        }
      >
        Fácil
      </Button>

      <Button
        className="
          bg-yellow-600
          hover:bg-yellow-600
          text-black
        "
        onClick={() =>
          escolherDificuldade("medio")
        }
      >
        Médio
      </Button>

      <Button
        className="
          bg-red-800
          hover:bg-red-900
        "
        onClick={() =>
          escolherDificuldade("dificil")
        }
      >
        Difícil
      </Button>

    </div>

  </CardContent>

</Card>
      {/* PERGUNTA */}

      <Card className="bg-zinc-900 border-zinc-800 rounded-3xl">

        <CardContent className="p-10 space-y-8">

          <div className="flex gap-4">

            {categoria && (

              <Badge className="text-lg px-4 py-2">
                {categoria}
              </Badge>

            )}

            {dificuldade && (

              <Badge className="text-lg px-4 py-2 bg-orange-500">

                {dificuldade === "facil" && "Fácil"}
                {dificuldade === "medio" && "Médio"}
                {dificuldade === "dificil" && "Difícil"}

              </Badge>

            )}

          </div>

          <h2 className="text-4xl font-bold leading-relaxed">

            Qual filme ganhou o Oscar em 1998?

          </h2>

        </CardContent>

      </Card>


      {/* RESPOSTA */}

      <Card className="bg-zinc-900 border-zinc-800 rounded-3xl">

        <CardContent className="p-8">

          <h2 className="text-2xl font-bold mb-4">
            Resposta da equipe
          </h2>

          <textarea
            value={resposta}
            onChange={(e) =>
              setResposta(e.target.value)
            }
            placeholder="Digite a resposta..."
            className="
              w-full
              h-32
              rounded-2xl
              bg-zinc-800
              border
              border-zinc-700
              p-4
              text-lg
            "
          />

          <div className="flex gap-4 mt-6 flex-wrap">

            <Button className="bg-green-600">
              ✅ Acertou
            </Button>

            <Button className="bg-red-600">
              ❌ Errou
            </Button>

            <Button className="bg-blue-600">
              ⏭ Próxima Equipe
            </Button>

          </div>

        </CardContent>

      </Card>


      {/* PLACAR */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card className="bg-blue-950 border-blue-700 rounded-3xl">

          <CardContent className="p-8">

            <h3 className="text-2xl font-bold">
              Time Azul
            </h3>

            <p className="text-5xl font-black mt-4">
              15
            </p>

            <span className="text-zinc-300">
              pontos
            </span>

          </CardContent>

        </Card>


        <Card className="bg-green-950 border-green-700 rounded-3xl">

          <CardContent className="p-8">

            <h3 className="text-2xl font-bold">
              Time Verde
            </h3>

            <p className="text-5xl font-black mt-4">
              8
            </p>

            <span className="text-zinc-300">
              pontos
            </span>

          </CardContent>

        </Card>


        <Card className="bg-red-950 border-red-700 rounded-3xl">

          <CardContent className="p-8">

            <h3 className="text-2xl font-bold">
              Time Vermelho
            </h3>

            <p className="text-5xl font-black mt-4">
              5
            </p>

            <span className="text-zinc-300">
              pontos
            </span>

          </CardContent>

        </Card>

      </div>

    </div>

    </div>

    </div>



  );
}  
