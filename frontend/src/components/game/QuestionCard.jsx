import {
  Card,
  CardContent,
} from "../ui/card";

export default function QuestionCard({
  pergunta
}) {

  if (!pergunta) {

    return (

      <Card>

        <CardContent
          className="p-8 text-center"
        >

          <h2
            className="
              text-2xl
              text-zinc-400
            "
          >
            Selecione uma categoria e
            dificuldade para iniciar
          </h2>

        </CardContent>

      </Card>

    );

  }

  return (

    <Card
      className="
        bg-zinc-900
        border-zinc-700
      "
    >

      <CardContent
        className="p-8"
      >

        <div
          className="
            flex
            justify-between
            mb-6
          "
        >

          <span
            className="
              bg-blue-600
              px-3
              py-1
              rounded-lg
              font-bold
            "
          >
            {pergunta.categoria}
          </span>

          <span
            className="
              bg-yellow-500
              text-black
              px-3
              py-1
              rounded-lg
              font-bold
            "
          >
            {pergunta.pontos} pts
          </span>

        </div>

        <div
          className="
            mb-4
            text-zinc-400
            uppercase
          "
        >
          {pergunta.dificuldade}
        </div>

        <h2
          className="
            text-3xl
            font-bold
            leading-relaxed
          "
        >
          {pergunta.texto}
        </h2>

      </CardContent>

    </Card>

  );

}