import api from "./api";

export async function listarCategorias() {
    const response =
        await api.get(
            "/categorias"
        );

    return response.data;
}