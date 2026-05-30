import axios from "axios";

const api = axios.create({

    baseURL: "http://127.0.0.1:5000"

});

export async function getTeams() {

    const response = await api.get("/equipes");

    return response.data;
}

export async function createTeam(data) {

    const response = await api.post(
        "/equipes",
        data
    );

    return response.data;
}

export async function deleteTeam(id) {

    const response = await api.delete(
        `/equipes/${id}`
    );

    return response.data;
}