import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import {
  Trophy,
  Users,
  LayoutDashboard,
  House,
} from "lucide-react";

import Home from "./pages/Home";
import Game from "./pages/Game";
import Teams from "./pages/Teams";
import Dashboard from "./pages/Dashboard";

export default function App() {

  return (

    <BrowserRouter>

   

      <div className="min-h-screen bg-zinc-950 text-white">

        {/* HEADER */}

        <header className="border-b border-zinc-800 bg-zinc-900">

          <div className="
            max-w-7xl
            mx-auto
            px-6
            py-5
            flex
            items-center
            justify-between
          ">

            {/* LOGO */}

            <h1 className="
              text-4xl
              font-black
              text-yellow-400
              tracking-wide
            ">
              QUIZ GAME
            </h1>


            {/* MENU */}

            <nav className="flex gap-4">

              <Link
                to="/"
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  bg-zinc-800
                  hover:bg-zinc-700
                  transition
                "
              >
                <House size={22} />

                Home
              </Link>


              <Link
                to="/jogo"
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  bg-zinc-800
                  hover:bg-zinc-700
                  transition
                "
              >
                <Trophy size={22} />

                Jogo
              </Link>


              <Link
                to="/equipes"
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  bg-zinc-800
                  hover:bg-zinc-700
                  transition
                "
              >
                <Users size={44} />

                Equipes
              </Link>


              <Link
                to="/dashboard"
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  bg-zinc-800
                  hover:bg-zinc-700
                  transition
                "
              >
                <LayoutDashboard size={22} />

                Dashboard
              </Link>

            </nav>

          </div>

        </header>


        {/* CONTEÚDO */}

        <main className="
          max-w-7xl
          mx-auto
          px-6
          py-10
        ">

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/jogo"
              element={<Game />}
            />

            <Route
              path="/equipes"
              element={<Teams />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}