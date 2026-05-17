import unicodedata

from app.models.pergunta import Pergunta


def normalizar_texto(texto):

    texto = texto.lower().strip()

    texto = unicodedata.normalize(
        "NFKD",
        texto
    ).encode(
        "ASCII",
        "ignore"
    ).decode(
        "utf-8"
    )

    return texto


def validar_resposta(
    pergunta_id,
    resposta_jogador
):

    pergunta = Pergunta.query.get(pergunta_id)

    if not pergunta:
        return {
            "erro": "Pergunta não encontrada"
        }

    resposta_jogador = normalizar_texto(
        resposta_jogador
    )

    respostas_aceitas = []

    for resposta in pergunta.respostas:

        resposta_normalizada = normalizar_texto(
            resposta.resposta
        )

        respostas_aceitas.append(
            resposta_normalizada
        )

        # igualdade exata
        if resposta_jogador == resposta_normalizada:

            return {
                "correto": True,
                "pontos": pergunta.pontos
            }

        # contém parte da resposta
        if resposta_jogador in resposta_normalizada:

            return {
                "correto": True,
                "pontos": pergunta.pontos
            }

    return {
        "correto": False,
        "respostas_aceitas": respostas_aceitas
    }