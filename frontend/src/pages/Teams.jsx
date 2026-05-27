import { useEffect, useState } from "react";

import api from "../services/api";

export default function Teams() {

    const [equipes, setEquipes] = useState([]);

    async function carregarEquipes() {

        try {

            const response =
                await api.get("/equipes");

            setEquipes(response.data);

        } catch (erro) {

            console.error(erro);
        }
    }

    useEffect(() => {

        carregarEquipes();

    }, []);

    return (

        <div style={{ padding: "10px" }}>

            <h1>Times</h1>

            {

                equipes.map(equipe => (

                    <div
                        key={equipe.id}
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <strong
                            style={{
                                color: equipe.cor
                            }}
                        >
                            {equipe.nome}
                        </strong>

                        {" "}-

                        {equipe.pontos} pts

                    </div>
                ))
            }

        </div>
    );
}