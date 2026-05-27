import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom"

import {
  Trophy,
  Users,
  LayoutDashboard,
} from "lucide-react"

import { Button } from "./components/ui/button";

import Game from "./pages/Game"
import Teams from "./pages/Teams"
import Dashboard from "./pages/Dashboard"

export default function App() {

  return (

    <BrowserRouter>

      <div className="min-h-screen bg-zinc-950 text-white">

        {/* NAVBAR */}

        <header className="border-b border-zinc-800 bg-zinc-900">

          <div className="container mx-auto flex items-center justify-between p-4">

            <div className="flex items-center gap-2">

              <Trophy className="text-yellow-400" />

              <h1 className="text-2xl font-bold">
                QUIZ GAME
              </h1>

            </div>

            <nav className="flex gap-3">

              <Link to="/">

                <Button variant="secondary">

                  <Trophy />

                  Jogo

                </Button>

              </Link>

              <Link to="/equipes">

                <Button variant="secondary">

                  <Users />

                  Equipes

                </Button>

              </Link>

              <Link to="/dashboard">

                <Button variant="secondary">

                  <LayoutDashboard />

                  Dashboard

                </Button>

              </Link>

            </nav>

          </div>

        </header>

        {/* CONTEÚDO */}

        <main className="container mx-auto p-6">

          <Routes>

            <Route
              path="/"
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
  )
}