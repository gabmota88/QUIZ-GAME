import api from "./api";

export async function getTeams() {

    const response =
        await api.get(
            "/equipes"
        );

    return response.data;
}

export async function createTeam(data) {

    const response =
        await api.post(
            "/equipes",
            data
        );

    return response.data;
}

export async function deleteTeam(id) {

    const response =
        await api.delete(
            `/equipes/${id}`
        );

    return response.data;
}


export async function sortearOrdemEquipes() {

    const response =
        await api.get(
            "/equipes/sortear-ordem"
        );

    return response.data;
}