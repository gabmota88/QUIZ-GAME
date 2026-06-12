import api from "./api";

export async function iniciarPartida() {

    const response =
        await api.post(
            "/partida"
        );

    return response.data;
}

export async function obterEstadoPartida() {

    const response =
        await api.get(
            "/partida"
        );

    return response.data;
}

export async function obterPlacar() {

    const response =
        await api.get(
            "/placar"
        );

    return response.data;
}

export async function proximoTurno() {

    const response =
        await api.post(
            "/partida/proximo-turno"
        );

    return response.data;
}

export async function definirPontosVitoria(
    pontos
) {

    const response =
        await api.post(
            "/pontos-vitoria",
            {
                pontos_vitoria: pontos
            }
        );

    return response.data;
}

export async function obterPontosVitoria() {

    const response =
        await api.get(
            "/pontos-vitoria"
        );

    return response.data;
}


    export async function zerarPlacar() {

    const response =
        await api.post(
            "/zerar-placar"
        );

    return response.data;
}
