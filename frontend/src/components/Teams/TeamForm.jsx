import { useState } from "react";

export default function TeamForm({
  onCreate
}) {

  const [nome, setNome] =
    useState("");

  const [cor, setCor] =
    useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    if (!nome) return;

    await onCreate({
      nome,
      cor
    });

    setNome("");
    setCor("");
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <input
        type="text"
        placeholder="Nome da equipe"
        value={nome}
        onChange={(e) =>
          setNome(e.target.value)
        }
        className="
          w-full
          p-3
          rounded
          bg-zinc-800
        "
      />

      <input
        type="text"
        placeholder="Cor"
        value={cor}
        onChange={(e) =>
          setCor(e.target.value)
        }
        className="
          w-full
          p-3
          rounded
          bg-zinc-800
        "
      />

      <button
        type="submit"
        className="
          bg-green-600
          px-4
          py-2
          rounded
        "
      >
        Criar Equipe
      </button>

    </form>
  );
}