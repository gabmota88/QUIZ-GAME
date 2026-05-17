let perguntaRespondida = false;

let perguntaAtual = null;

let equipes = [];

let equipeAtualIndex = 0;


// =========================
// CARREGAR EQUIPES
// =========================

aasync function carregarEquipes() {

    const response = await fetch(
        `${API_URL}/equipes`
    );

    equipes = await response.json();

    // ORDENA PELA ORDEM SORTEADA
    equipes.sort((a, b) => a.ordem - b.ordem);

    const lista =
        document.getElementById(
            "lista-equipes"
        );

    lista.innerHTML = "";

    equipes.forEach(equipe => {

        const item =
            document.createElement("li");

        // NOME COM A COR DA EQUIPE
        item.innerHTML = `

            <span
                style="
                    color:${equipe.cor};
                    font-weight:bold;
                "
            >
                ${equipe.nome}
            </span>

            - ${equipe.pontos} pts

            (ordem: ${equipe.ordem || "-"})

            <button
                onclick="deletarEquipe(${equipe.id})"
                style="
                    margin-left:10px;
                    background:red;
                    color:white;
                    border:none;
                    padding:4px 8px;
                    cursor:pointer;
                "
            >
                X
            </button>

        `;

        lista.appendChild(item);
    });
}


// =========================
// SALVAR EQUIPE
// =========================

document
    .getElementById(
        "btn-salvar-equipe"
    )
    .addEventListener(
        "click",
        salvarEquipe
    );


async function salvarEquipe() {

    const nome =
        document.getElementById(
            "nome-equipe"
        ).value;

    const cor =
        document.getElementById(
            "cor-equipe"
        ).value;

    if (!nome.trim()) {

        alert(
            "Digite o nome da equipe."
        );

        return;
    }

    const response = await fetch(
        `${API_URL}/equipes`,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                nome,
                cor
            })
        }
    );

    const data =
        await response.json();

    if (data.erro) {

        alert(data.erro);

        return;
    }

    alert(
        `Equipe ${data.nome} criada!`
    );

    document.getElementById(
        "nome-equipe"
    ).value = "";

    carregarEquipes();

    atualizarPlacar();
}


// =========================
// DELETAR EQUIPE
// =========================

async function deletarEquipe(id) {

    const confirmar = confirm(
        "Tem certeza que deseja deletar esta equipe?"
    );

    if (!confirmar) {

        return;
    }

    await fetch(

        `${API_URL}/equipes/${id}`,

        {
            method: "DELETE"
        }
    );

    carregarEquipes();

    atualizarPlacar();
}


// =========================
// INICIAR PARTIDA
// =========================

document
    .getElementById(
        "btn-iniciar-partida"
    )
    .addEventListener(
        "click",
        iniciarPartida
    );


async function iniciarPartida() {

    if (equipes.length < 2) {

        alert(
            "Cadastre pelo menos 2 equipes."
        );

        return;
    }

    await fetch(

        `${API_URL}/partida`,

        {
            method: "POST"
        }
    );

    alert(
        "Partida iniciada!"
    );
}


// =========================
// SORTEAR ORDEM
// =========================

document
    .getElementById(
        "btn-sortear"
    )
    .addEventListener(
        "click",
        sortearOrdem
    );


async function sortearOrdem() {

    const response = await fetch(
        `${API_URL}/equipes/sortear-ordem`
    );

    equipes = await response.json();

    // ORDENA PELO CAMPO ORDEM

    equipes.sort(
        (a, b) => a.ordem - b.ordem
    );

    equipeAtualIndex = 0;

    atualizarEquipeAtual();

    console.log(
        "ORDEM SORTEADA:",
        equipes
    );

 console.log(
    "ORDEM SORTEADA:",
    equipes
);

carregarEquipes();

alert("Ordem sorteada!");
}

// =========================
// EQUIPE ATUAL
// =========================

function atualizarEquipeAtual() {

    if (equipes.length === 0) {

        return;
    }

    const equipeAtual =
        equipes[equipeAtualIndex];

    console.log(
        "Equipe da vez:",
        equipeAtual
    );

    document.getElementById(
        "equipe-atual"
    ).innerHTML = `

        Equipe da vez:

        <span style="
            color:${equipeAtual.cor};
            font-weight:bold;
        ">
            ${equipeAtual.nome}
        </span>

    `;
}


// =========================
// BUSCAR PERGUNTA
// =========================

document
    .getElementById(
        "btn-buscar-pergunta"
    )
    .addEventListener(
        "click",
        carregarPergunta
    );


async function carregarPergunta() {

    if (perguntaAtual) {

        alert(
            "A equipe já possui uma pergunta."
        );

        return;
    }

    const dificuldade =

        document.getElementById(
            "dificuldade-select"
        ).value;

    const response = await fetch(

        `${API_URL}/perguntas/dificuldade/${dificuldade}`
    );

    perguntaAtual =
        await response.json();

    if (perguntaAtual.erro) {

        alert(
            perguntaAtual.erro
        );

        return;
    }

    document.getElementById(
        "pergunta"
    ).innerText =

        perguntaAtual.texto;

    document.getElementById(
        "categoria"
    ).innerText =

        `Categoria: ${perguntaAtual.categoria}`;

    perguntaRespondida = false;
}


// =========================
// RESPONDER
// =========================

document
    .getElementById(
        "btn-responder"
    )
    .addEventListener(
        "click",
        responderPergunta
    );


async function responderPergunta() {

    if (!perguntaAtual) {

        alert(
            "Carregue uma pergunta primeiro."
        );

        return;
    }

    const resposta =
        document.getElementById(
            "resposta-input"
        ).value;

    if (!resposta.trim()) {

        alert(
            "Digite uma resposta."
        );

        return;
    }

    // PEGA A EQUIPE ATUAL
    const equipeAtual =
        equipes[equipeAtualIndex];

    console.log(
        "Equipe atual:",
        equipeAtual.nome
    );

    console.log(
        "Index atual:",
        equipeAtualIndex
    );

    const response = await fetch(

        `${API_URL}/jogar`,

        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                equipe_id:
                    equipeAtual.id,

                pergunta_id:
                    perguntaAtual.id,

                resposta
            })
        }
    );

    const resultado =
        await response.json();

    console.log(
        "Resultado:",
        resultado
    );

    if (resultado.correto) {

        alert(
            `${equipeAtual.nome} acertou!`
        );

    } else {

        alert(
            `${equipeAtual.nome} errou!`
        );
    }

    atualizarPlacar();

    proximaEquipe();
}


// =========================
// PRÓXIMA EQUIPE
// =========================

function proximaEquipe() {

    if (equipes.length === 0) {

        return;
    }

    equipeAtualIndex++;

    // VOLTA PARA PRIMEIRA EQUIPE
    if (equipeAtualIndex >= equipes.length) {

        equipeAtualIndex = 0;
    }

    console.log(
        "PRÓXIMA EQUIPE:",
        equipes[equipeAtualIndex]
    );

    atualizarEquipeAtual();

    limparPergunta();
}


// =========================
// LIMPAR PERGUNTA
// =========================

function limparPergunta() {

    perguntaAtual = null;

    document.getElementById(
        "pergunta"
    ).innerText = "";

    document.getElementById(
        "categoria"
    ).innerText = "";

    document.getElementById(
        "resposta-input"
    ).value = "";
}


// =========================
// VERIFICAR VENCEDOR
// =========================

function verificarVencedor() {

    const pontosVitoria = Number(

        document.getElementById(
            "pontos-vitoria"
        ).value
    );

    const vencedor = equipes.find(

        equipe =>
            equipe.pontos >= pontosVitoria
    );

    if (vencedor) {

        alert(
            `${vencedor.nome} venceu o jogo com ${vencedor.pontos} pontos!`
        );
    }
}

// =========================
// PLACAR
// =========================

async function atualizarPlacar() {

    const response = await fetch(
        `${API_URL}/placar`
    );

    const placar =
        await response.json();

    const lista =
        document.getElementById(
            "lista-placar"
        );

    lista.innerHTML = "";

    placar.forEach(equipe => {

        const item =
            document.createElement("li");

        item.innerText =

            `${equipe.nome} - ${equipe.pontos} pts`;

        lista.appendChild(item);
    });
}


// =========================
// INICIALIZAÇÃO
// =========================

carregarEquipes();

atualizarPlacar();