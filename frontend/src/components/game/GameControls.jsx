import { Button } from "../ui/button";

export default function GameControls() {

  return (

    <div className="flex gap-4 flex-wrap">

      <Button>
        🎲 Sortear Ordem
      </Button>

      <Button>
        ▶️ Iniciar Jogo
      </Button>

      <Button>
        ⏹️ Finalizar
      </Button>

      <Button>
        🔄 Zerar Placar
      </Button>

    </div>

  );

}