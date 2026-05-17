async function carregarPergunta() {

    const response = await fetch(
        `${API_URL}/perguntas/aleatoria`
    );

    const pergunta = await response.json();

    document.getElementById(
        "pergunta"
    ).innerText = pergunta.texto;

    document.getElementById(
        "dificuldade"
    ).innerText =
        "Dificuldade: " +
        pergunta.dificuldade;
}

carregarPergunta();