import { useState } from "react";


import ColorPicker from "./ColorPicker";
import AvatarCarousel from "./AvatarCarousel";


export default function TeamForm({
  onCreate
}) {

  const [nome, setNome] =
    useState("");

  const [cor, setCor] =
    useState("");

  const [avatar, setAvatar] =
    useState(""); 

  async function handleSubmit(e) {

    e.preventDefault();

    if (!nome) return;

    await onCreate({
      nome,
      cor,
      avatar
    });

    setNome("");
    setCor("");
    setAvatar("");
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
      <ColorPicker
        selected={cor}
        onSelect={setCor}
      />
      {cor && (
        <AvatarCarousel
          selected={avatar}
          onSelect={setAvatar}
        />
      )}

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