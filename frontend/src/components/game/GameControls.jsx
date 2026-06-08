import { Button } from "../ui/button";

export default function GameControls({

  onSortearOrdem,
  onIniciarJogo,
  onFinalizarJogo,
  onZerarPlacar

}) {

  return (

    <div
      className="grid grid-cols-4 gap-4"
    >

      <Button
        onClick={onSortearOrdem}
        className="bg-[#BF00FF] hover:opacity-80 text-white p-6 text-xl font-bold rounded-xl h-auto transition shadow-[0_0_15px_#BF00FF]"
      >
         Sortear Ordem
      </Button>

      <Button
        onClick={onZerarPlacar}
        className="bg-[#CCFF00] hover:opacity-80 text-black p-6 text-xl font-bold rounded-xl h-auto transition shadow-[0_0_15px_#CCFF00]"
      >
        Zerar Placar
      </Button>

      <Button
        onClick={onFinalizarJogo}
        className="bg-[#FF3131] hover:opacity-80 text-white p-6 text-xl font-bold rounded-xl h-auto transition shadow-[0_0_15px_#FF3131]"
      >
         Finalizar Partida
      </Button>

      <Button
        onClick={onIniciarJogo}
        className="bg-[#39FF14] hover:opacity-80 text-black p-6 text-xl font-bold rounded-xl h-auto transition shadow-[0_0_15px_#39FF14]"
      >
         Iniciar Jogo !!!
      </Button>

    </div>

  );

}