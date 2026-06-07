import api from "./api";

export async function buscarPergunta(
    categoriaId,
    dificuldade
) {

    const response =
        await api.post(
            "/perguntas/sorteio",
            {
                categoria_id:
                    categoriaId,

                dificuldade:
                    dificuldade
            }
        );

    return response.data;
}

export async function responderPergunta(
    equipeId,
    perguntaId,
    resposta
) {

    const response =
        await api.post(
            "/jogar",
            {
                equipe_id:
                    equipeId,

                pergunta_id:
                    perguntaId,

                resposta:
                    resposta
            }
        );

    return response.data;
}