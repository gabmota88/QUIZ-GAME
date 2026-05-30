import {
  Trophy,
  Users,
  LayoutDashboard,
} from "lucide-react";

export default function Home() {

  return (

    <div className="
      flex
      flex-col
      items-center
      justify-center
      text-center
      gap-10
      py-20
    ">

      {/* TÍTULO */}

      <div>

        <h1 className="
          text-7xl
          font-black
          text-yellow-400
        ">
          QUIZ GAME
        </h1>

        <p className="
          text-2xl
          text-zinc-400
          mt-5
        ">
          Sistema multiplayer de perguntas e respostas
        </p>

      </div>


      {/* CARDS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-8
        w-full
      ">

        {/* JOGO */}

        <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-10
          hover:scale-105
          transition
        ">

          <Trophy
            size={70}
            className="mx-auto text-yellow-400"
          />

          <h2 className="
            text-3xl
            font-bold
            mt-6
          ">
            Jogo
          </h2>

          <p className="
            text-zinc-400
            mt-4
            text-lg
          ">
            Inicie partidas e controle as rodadas.
          </p>

        </div>


        {/* EQUIPES */}

        <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-10
          hover:scale-105
          transition
        ">

          <Users
            size={70}
            className="mx-auto text-blue-400"
          />

          <h2 className="
            text-3xl
            font-bold
            mt-6
          ">
            Equipes
          </h2>

          <p className="
            text-zinc-400
            mt-4
            text-lg
          ">
            Crie equipes, cores e avatares.
          </p>

        </div>


        {/* DASHBOARD */}

        <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-10
          hover:scale-105
          transition
        ">

          <LayoutDashboard
            size={70}
            className="mx-auto text-green-400"
          />

          <h2 className="
            text-3xl
            font-bold
            mt-6
          ">
            Dashboard
          </h2>

          <p className="
            text-zinc-400
            mt-4
            text-lg
          ">
            Visualize ranking e estatísticas.
          </p>

        </div>

      </div>

    </div>
  );
}