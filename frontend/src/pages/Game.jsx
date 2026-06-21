import { useState, useEffect } from "react";

import GameHeader from "../components/game/GameHeader";
import GameControls from "../components/game/GameControls";
import QuestionCard from "../components/game/QuestionCard";
import TimerCircle from "../components/game/TimerCircle";

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
  iniciarPartida,
  definirPontosVitoria,
   obterPlacar,
   zerarPlacar
}
from "../services/gameService";



import {
  buscarPergunta
,
  responderPergunta
}
from "../services/questionsService"



function normalizarAvatar(avatar) {
  if (!avatar) {
    return "/avatars/Goku.png";
  }

  const nomeArquivo = avatar.split("/").pop();

  return `/avatars/${nomeArquivo}`;
}






export default function Game() {

  const [categorias, setCategorias] =
    useState([]);

  const [equipes, setEquipes] =
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
       
    const [placar, setPlacar] =
  useState([]); 
  
    const [rodadaAtual,
  setRodadaAtual] =
  useState(1);

    const [
     pontosVitoria,
     setPontosVitoria
       ] = useState(15);

    const [campeao, setCampeao] =
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

  useEffect(() => {
    async function carregarPergunta() {
      if (!categoriaSelecionada || !dificuldadeSelecionada) return;

      try {
        const pergunta = await buscarPergunta(
          categoriaSelecionada.id,
          dificuldadeSelecionada
        );
        console.log("Pergunta:", pergunta);
        setPerguntaAtual(pergunta);
      } catch (erro) {
        console.error(erro);
      }
    }

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

    console.log(resultado);

    setResultadoResposta(
      resultado
    );
    await carregarPlacar();

    if (resultado.vencedor) {

      setCampeao({

        nome:
          resultado.vencedor,

        cor:
          equipeAtual.cor,

        avatar:
          equipeAtual.avatar,

          ranking:[
            ...placar,
            ]

      });

      return;

    }

    if (!resultado.correto) {

      alert(

`❌ RESPOSTA INCORRETA!!!!

Resposta correta:

${resultado.resposta_correta}`

      );

    }

    await carregarPlacar();

    setRodadaAtual(
      resultado.rodada_atual
    );

    const proximaEquipe =
      ordemEquipes.find(

        equipe =>

          equipe.nome ===
          resultado.proxima_equipe

      );

    if (proximaEquipe) {

      setEquipeAtual(
        proximaEquipe
      );

    }

    setTimeout(() => {

      setRespostaJogador("");

      setPerguntaAtual(null);

      setCategoriaSelecionada(null);

      setDificuldadeSelecionada(null);

      setResultadoResposta(null);

    }, 200);

  } catch (erro) {

    console.error(erro);

    alert(
      "Erro ao responder."
    );

  }

}

async function carregarPlacar() {

  try {

    const dados =
      await obterPlacar();

    setPlacar(
      dados
    );

  } catch (erro) {

    console.error(
      erro
    );

  }

}

useEffect(() => {

  carregarPlacar();

}, []);


async function resetarJogo() {

  setCampeao(null);

  setPartidaIniciada(false);

  setEquipeAtual(null);

  setOrdemEquipes([]);

  setPerguntaAtual(null);

  setCategoriaSelecionada(null);

  setDificuldadeSelecionada(null);

  setResultadoResposta(null);

  setRespostaJogador("");

  setRodadaAtual(1);

  await zerarPlacar();

  await carregarPlacar();

}

if (campeao) {
  const rankingFinal = campeao.placar || placar || [];

  return (
    <div
      onClick={resetarJogo}
      className="
        min-h-screen
        flex
        flex-col
        items-center
        justify-center
        p-8
        cursor-pointer
      "
      style={{
        backgroundColor: campeao.cor,
      }}
    >
      <h1
        className="
          text-5xl
          md:text-7xl
          font-black
          text-white
          mb-8
          text-center
        "
      >
        🏆 CAMPEÃO 🏆
      </h1>

    <img
  src={normalizarAvatar(campeao.avatar)}
  alt={campeao.nome}
  className="
    w-56
    h-56
    rounded-full
    object-cover
    border-8
    border-white
    mb-6
  "
  onError={(e) => {
    e.currentTarget.src = "/avatars/Goku.png";
  }}
/>

      <h2
        className="
          text-4xl
          md:text-5xl
          font-black
          text-white
          mb-10
          text-center
        "
      >
        {campeao.nome}
      </h2>

      <div
        className="
          bg-black/30
          backdrop-blur-sm
          rounded-2xl
          p-6
          md:p-8
          w-full
          max-w-3xl
        "
      >
        <h3
          className="
            text-2xl
            md:text-3xl
            font-black
            text-white
            mb-6
            text-center
          "
        >
          Ranking Final
        </h3>

        {rankingFinal.length > 0 ? (
          rankingFinal.map((equipe, index) => (
            <div
              key={equipe.nome}
              className="
                flex
                justify-between
                items-center
                p-4
                mb-3
                rounded-xl
                bg-white/10
                text-white
              "
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && `${index + 1}º`}
                </span>

                <span className="font-bold text-lg">
                  {equipe.nome}
                </span>
              </div>

              <div className="font-black text-2xl">
                {equipe.pontos} pts
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-white">
            Carregando ranking final...
          </p>
        )}
      </div>

      <p
        className="
          mt-8
          text-white
          text-center
          text-lg
        "
      >
        Clique em qualquer lugar para iniciar um novo jogo
      </p>
    </div>
  );
}








 return (
  <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-6">
    {/* =========================================================
        HEADER
    ========================================================= */}
    <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-[0_0_20px_rgba(0,212,255,0.08)] md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-wide text-[#00D4FF] md:text-3xl">
          QUIZ GAME
        </h1>

        <p className="text-sm text-zinc-400">
          Painel de controle da partida
        </p>
      </div>

      {/* Caso você ainda não tenha navegação entre telas,
          estes botões podem ficar apenas visuais por enquanto. */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-zinc-700"
        >
          JOGO
        </button>

        <button
          type="button"
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-zinc-700"
        >
          DASHBOARD
        </button>

        <button
          type="button"
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-zinc-700"
        >
          EQUIPES
        </button>
      </div>
    </header>

    {/* =========================================================
        ÁREA PRINCIPAL: 3 COLUNAS
    ========================================================= */}
    <main className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
      {/* =======================================================
          COLUNA ESQUERDA - CONTROLES
      ======================================================= */}
      <aside className="space-y-5">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-lg font-black text-[#BF00FF]">
            CONTROLES DO JOGO
          </h2>

          <GameControls
            onSortearOrdem={sortearOrdem}
            onIniciarJogo={async () => {
              try {
                const partida = await iniciarPartida(pontosVitoria);

                console.log("Partida criada:", partida);

                setPartidaIniciada(true);

                await carregarPlacar();
              } catch (erro) {
                console.error(erro);
                alert("Erro ao iniciar partida.");
              }
            }}
            onFinalizarJogo={() => {
              const vencedor = placar[0];

              if (vencedor) {
                alert(`🏆 Campeão: ${vencedor.nome}`);
              }

              setPartidaIniciada(false);

              setPerguntaAtual(null);
              setRespostaJogador("");
              setCategoriaSelecionada(null);
              setDificuldadeSelecionada(null);
              setResultadoResposta(null);
            }}
            onZerarPlacar={async () => {
              try {
                await zerarPlacar();

                await carregarPlacar();

                alert("Placar zerado!");
              } catch (erro) {
                console.error(erro);
                alert("Erro ao zerar placar.");
              }
            }}
          />
        </section>

        {/* PONTOS PARA VITÓRIA */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-3 text-lg font-black text-[#CCFF00]">
            PONTOS PARA VITÓRIA
          </h2>

          <select
            value={pontosVitoria}
            onChange={async (e) => {
              const valor = Number(e.target.value);

              setPontosVitoria(valor);

              try {
                await definirPontosVitoria(valor);
              } catch (erro) {
                console.error(erro);
                alert("Erro ao atualizar pontos para vitória.");
              }
            }}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 font-bold text-white outline-none focus:border-[#CCFF00]"
          >
            <option value="10">10 pontos</option>
            <option value="15">15 pontos</option>
            <option value="20">20 pontos</option>
            <option value="30">30 pontos</option>
            <option value="50">50 pontos</option>
            <option value="100">100 pontos</option>
          </select>
        </section>

        {/* CATEGORIAS */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-lg font-black text-[#00D4FF]">
            CATEGORIAS
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (!partidaIniciada) {
                    alert("Inicie a partida primeiro.");
                    return;
                  }

                  setCategoriaSelecionada(cat);

                  console.log("Categoria:", cat.nome);
                }}
                className={`rounded-xl p-3 text-sm font-black transition ${
                  categoriaSelecionada?.id === cat.id
                    ? "bg-[#00D4FF] text-black shadow-[0_0_15px_#00D4FF]"
                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                {cat.nome}
              </button>
            ))}
          </div>

          {categoriaSelecionada && (
            <div className="mt-4 rounded-xl border border-[#00D4FF] bg-[#00D4FF]/10 p-3 text-sm">
              Categoria:
              <strong className="ml-2 uppercase text-[#00D4FF]">
                {categoriaSelecionada.nome}
              </strong>
            </div>
          )}
        </section>

        {/* DIFICULDADE */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-lg font-black text-orange-400">
            DIFICULDADE
          </h2>

          <DificuldadeSelector
            onSelect={(nivel) => {
              if (!partidaIniciada) {
                alert("Inicie a partida primeiro.");
                return;
              }

              if (!categoriaSelecionada) {
                alert("Selecione uma categoria primeiro.");
                return;
              }

              setDificuldadeSelecionada(nivel);

              console.log("Dificuldade:", nivel);
            }}
          />

          {dificuldadeSelecionada && (
            <div className="mt-4 rounded-xl border border-orange-400 bg-orange-400/10 p-3 text-sm">
              Dificuldade:
              <strong className="ml-2 uppercase text-orange-400">
                {dificuldadeSelecionada}
              </strong>
            </div>
          )}
        </section>
      </aside>

      {/* =======================================================
          COLUNA CENTRAL - JOGO
      ======================================================= */}
      <section className="min-w-0 space-y-5">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <GameHeader rodada={rodadaAtual} />
        </div>

        {/* EQUIPE ATUAL */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          {equipeAtual ? (
            <div className="flex items-center gap-5">
             <img
  src={normalizarAvatar(equipeAtual.avatar)}
  alt={equipeAtual.nome}
  className="
    w-32
    h-32
    rounded-full
    object-cover
    border-4
  "
  style={{
    borderColor: equipeAtual.cor,
    boxShadow: `0 0 20px ${equipeAtual.cor}`,
  }}
  onError={(e) => {
    e.currentTarget.src = "/avatars/Goku.png";
  }}
/>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                  Equipe atual
                </p>

                <h2
                  className="text-2xl font-black md:text-3xl"
                  style={{ color: equipeAtual.cor }}
                >
                  {equipeAtual.nome}
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Aguarde a pergunta e responda dentro do tempo.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-zinc-400">
              Inicie uma partida para definir a equipe atual.
            </div>
          )}
        </section>

        {/* ÁREA FIXA DA PERGUNTA */}
        <section className="min-h-[260px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-center text-lg font-black text-[#00D4FF]">
            PERGUNTA
          </h2>

          {perguntaAtual ? (
            <QuestionCard pergunta={perguntaAtual} />
          ) : (
            <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/50 p-6 text-center text-zinc-500">
              Selecione uma categoria e uma dificuldade para sortear uma pergunta.
            </div>
          )}
        </section>

        {/* ÁREA DE RESPOSTA */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-lg font-black text-green-400">
            RESPOSTA
          </h2>

          {perguntaAtual ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Digite sua resposta"
                value={respostaJogador}
                onChange={(e) => setRespostaJogador(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    enviarResposta();
                  }
                }}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-lg outline-none transition focus:border-green-400"
              />

              <button
                type="button"
                onClick={enviarResposta}
                className="w-full rounded-xl bg-green-500 p-4 font-black text-black shadow-lg shadow-green-500/40 transition hover:bg-green-400"
              >
                RESPONDER
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-zinc-800 p-4 text-center text-zinc-500">
              A área de resposta será liberada quando houver uma pergunta.
            </div>
          )}
        </section>

        {/* RESULTADO */}
        {resultadoResposta && (
          <section
            className={`rounded-2xl p-5 text-center text-xl font-black ${
              resultadoResposta.correto
                ? "bg-green-700 shadow-[0_0_20px_rgba(34,197,94,0.45)]"
                : "bg-red-700 shadow-[0_0_20px_rgba(239,68,68,0.45)]"
            }`}
          >
            {resultadoResposta.correto
              ? "✅ RESPOSTA CORRETA"
              : "❌ RESPOSTA INCORRETA"}
          </section>
        )}

        {/* TIMER */}
        <section className="flex justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <TimerCircle />
        </section>
      </section>

      {/* =======================================================
          COLUNA DIREITA - EQUIPES E PLACAR
      ======================================================= */}
      <aside className="space-y-5">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-lg font-black text-[#CCFF00]">
            ORDEM DAS EQUIPES
          </h2>

          <div className="space-y-3">
            {ordemEquipes.length > 0 ? (
              ordemEquipes.map((equipe, index) => (
                <div
                  key={equipe.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                    equipeAtual?.id === equipe.id
                      ? "border-white bg-zinc-800"
                      : "border-zinc-800 bg-zinc-950"
                  }`}
                  style={{
                    borderLeftWidth: "5px",
                    borderLeftColor: equipe.cor,
                  }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-black text-zinc-300">
                    {index + 1}
                  </div>

                  <img
                    src={normalizarAvatar(equipe.avatar)}
                    alt={equipe.nome}
                  className="
                     w-14
                     h-14
                     shrink-0
                     rounded-full
                     object-cover
                    border-2
                          "
                   style={{
                      borderColor: equipe.cor,
                     boxShadow: `0 0 10px ${equipe.cor}`,
                          }}
                      onError={(e) => {
                       e.currentTarget.src = "/avatars/Goku.png";
                       }}
                      />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black">{equipe.nome}</p>

                    <p className="text-sm text-zinc-400">
                      {equipe.pontos ?? 0} pontos
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-zinc-800 p-4 text-center text-sm text-zinc-500">
                Sorteie a ordem das equipes.
              </p>
            )}
          </div>
        </section>

        {/* PLACAR GERAL */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-lg font-black text-[#BF00FF]">
            PLACAR GERAL
          </h2>

          <div className="space-y-3">
            {placar.map((equipe, index) => (
              <div
                key={equipe.nome}
                className="flex items-center justify-between rounded-xl bg-zinc-800 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-zinc-400">
                    {index + 1}º
                  </span>

                  <div>
                    <p className="font-bold">{equipe.nome}</p>

                    <p className="text-xs text-zinc-400">
                      Equipe no ranking
                    </p>
                  </div>
                </div>

                <span className="text-2xl font-black text-[#CCFF00]">
                  {equipe.pontos}
                </span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </main>
  </div>
  );  
}