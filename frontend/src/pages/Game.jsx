import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
export default function Game() {

  return (

    <div className="grid gap-6">

      {/* TOPO */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Rodada 1
          </h1>

          <p className="text-zinc-400">
            Equipe atual: Azul
          </p>

        </div>

        <Badge className="text-lg px-4 py-2">

          10 pontos

        </Badge>

      </div>

      {/* PERGUNTA */}

      <Card className="bg-zinc-900 border-zinc-800">

        <CardContent className="p-8">

          <div className="flex items-center gap-3 mb-6">

            <Badge>
              Filmes
            </Badge>

            <Badge variant="secondary">
              Médio
            </Badge>

          </div>

          <h2 className="text-3xl font-bold mb-8">

            Qual filme ganhou o Oscar em 1998?

          </h2>

          <div className="flex gap-4">

            <Button size="lg">

              Responder

            </Button>

            <Button
              size="lg"
              variant="secondary"
            >

              Pular

            </Button>

          </div>

        </CardContent>

      </Card>

      {/* PLACAR */}

      <div className="grid md:grid-cols-3 gap-4">

        <Card className="bg-blue-950 border-blue-800">

          <CardContent className="p-6">

            <h3 className="text-xl font-bold">
              Time Azul
            </h3>

            <p className="text-3xl mt-4">
              15 pts
            </p>

          </CardContent>

        </Card>

        <Card className="bg-green-950 border-green-800">

          <CardContent className="p-6">

            <h3 className="text-xl font-bold">
              Time Verde
            </h3>

            <p className="text-3xl mt-4">
              8 pts
            </p>

          </CardContent>

        </Card>

        <Card className="bg-red-950 border-red-800">

          <CardContent className="p-6">

            <h3 className="text-xl font-bold">
              Time Vermelho
            </h3>

            <p className="text-3xl mt-4">
              5 pts
            </p>

          </CardContent>

        </Card>

      </div>

    </div>
  )
}