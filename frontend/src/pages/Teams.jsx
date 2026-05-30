import { useEffect, useState } from "react";

import {
    Trash2,
    Users,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "../components/ui/card";

import { Button } from "../components/ui/button";

import {
    getTeams,
    createTeam,
    deleteTeam,
} from "../services/teamService";


const avatars = [

    "🐺",
    "🦁",
    "🐯",
    "🦅",
    "🐲",
    "🦈",
    "🦂",
    "🔥"
];


const colors = {
  blue: "#3b82f6",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
  purple: "#a855f7",
  orange: "#f97316",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  pink: "#ec4899",
  indigo: "#6366f1",
  lime: "#84cc16",
  emerald: "#10b981",
  rose: "#f43f5e",
  fuchsia: "#d946ef",
  gray: "#6b7280",
  stone: "#78716c",
  lightLime: "#a3e635",
  lightBlue: "#60a5fa",
  lightRose: "#fb7185",
  lightTeal: "#2dd4bf"
};


export default function Teams() {

    const [teams, setTeams] = useState([]);

    const [name, setName] = useState("");

    const [color, setColor] = useState(colors[0]);

    const [avatar, setAvatar] = useState(avatars[0]);


    async function loadTeams() {

        try {

            const data = await getTeams();

            setTeams(data);

        } catch (error) {

            console.log(error);
        }
    }


    async function handleCreateTeam() {

        if (!name) return;

        try {

            await createTeam({

                nome: name,
                cor: color,
                avatar: avatar
            });

            setName("");

            loadTeams();

        } catch (error) {

            console.log(error);
        }
    }


    async function handleDelete(id) {

        try {

            await deleteTeam(id);

            loadTeams();

        } catch (error) {

            console.log(error);
        }
    }


    useEffect(() => {

        loadTeams();

    }, []);


    return (

        <div className="space-y-10">

            {/* HEADER */}

            <div className="text-center">

                <h1 className="
                    text-5xl
                    font-black
                    text-yellow-400
                ">
                    EQUIPES
                </h1>

                <p className="
                    text-zinc-400
                    text-xl
                    mt-3
                ">
                    Gerencie as equipes do jogo
                </p>

            </div>


            {/* FORM */}

            <Card className="
    bg-zinc-900
    border-zinc-800
    rounded-3xl
">


                <CardContent className="p-8 space-y-8">

                    <div>

                        <h2 className="
                            text-3xl
                            font-bold
                            mb-6
                        ">
                            Nova equipe
                        </h2>

                        {/* INPUT */}

                        <input
                            type="text"
                            placeholder="Nome da equipe"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="
                                w-full
                                p-4
                                rounded-2xl
                                bg-zinc-800
                                border
                                border-zinc-700
                                text-xl
                            "
                        />

                    </div>


                    {/* CORES */}

                    <div>

                        <h3 className="
                            text-xl
                            font-bold
                            mb-4
                        ">
                            Cor da equipe
                        </h3>

                        <div className="flex gap-4">

                            {colors.map((c) => (

                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`
                                        w-14
                                        h-14
                                        rounded-full
                                        border-4
                                        transition
                                        ${color === c
                                            ? "border-white scale-110"
                                            : "border-transparent"}
                                    `}
                                    style={{
                                        background: c
                                    }}
                                />

                            ))}

                        </div>

                    </div>


                    {/* AVATARES */}

                    <div>

                        <h3 className="
                            text-xl
                            font-bold
                            mb-4
                        ">
                            Avatar
                        </h3>

                        <div className="flex gap-4 flex-wrap">

                            {avatars.map((a) => (

                                <button
                                    key={a}
                                    onClick={() => setAvatar(a)}
                                    className={`
                                        text-4xl
                                        p-4
                                        rounded-2xl
                                        transition
                                        ${avatar === a
                                            ? "bg-yellow-400 scale-110"
                                            : "bg-zinc-800"}
                                    `}
                                >
                                    {a}
                                </button>

                            ))}

                        </div>

                    </div>


                    {/* BOTÃO */}

                    <Button
                        onClick={handleCreateTeam}
                        className="
                            w-full
                            h-14
                            text-xl
                            rounded-2xl
                            bg-yellow-400
                            text-black
                            hover:bg-yellow-300
                        "
                    >
                        Criar equipe
                    </Button>

                </CardContent>

            </Card>


            {/* LISTA */}

            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-6
            ">

                {teams.map((team) => (

                    <Card
                        key={team.id}
                        className="
                            bg-zinc-900
                            border-zinc-800
                            rounded-3xl
                        "
                    >

                        <CardContent className="p-8">

                            <div className="
                                flex
                                flex-col
                                items-center
                                text-center
                            ">

                                {/* AVATAR */}

                                <div
                                    className="
                                        w-24
                                        h-24
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        text-5xl
                                    "
                                    style={{
                                        background: team.cor
                                    }}
                                >
                                    {team.avatar}
                                </div>


                                {/* NOME */}

                                <h2 className="
                                    text-3xl
                                    font-black
                                    mt-5
                                ">
                                    {team.nome}
                                </h2>


                                {/* PONTOS */}

                                <p className="
                                    text-zinc-400
                                    mt-2
                                    text-lg
                                ">
                                    {team.pontos} pontos
                                </p>


                                {/* BOTÃO */}

                                <Button
                                    onClick={() =>
                                        handleDelete(team.id)
                                    }
                                    className="
                                        mt-6
                                        bg-red-500
                                        hover:bg-red-400
                                        rounded-2xl
                                    "
                                >

                                    <Trash2 />

                                    Excluir

                                </Button>

                            </div>

                        </CardContent>

                    </Card>

                ))}

            </div>

        </div>
    );
}