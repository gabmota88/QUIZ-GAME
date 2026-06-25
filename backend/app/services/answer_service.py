import unicodedata

from app.models.pergunta import Pergunta
from app.models.resposta import RespostaAceita
from app.models.alternativa import Alternativa


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
    resposta_usuario
):

    pergunta = Pergunta.query.get(
        pergunta_id
    )

    if not pergunta:

        return {
            "correto": False,
            "mensagem": "Pergunta não encontrada"
        }

    # =========================
    # MÚLTIPLA ESCOLHA
    # =========================

    if pergunta.tipo == "multipla_escolha":

        alternativa = Alternativa.query.filter_by(
            id=resposta_usuario,
            pergunta_id=pergunta_id
        ).first()

        if not alternativa:

            return {
                "correto": False,
                "mensagem": "Alternativa inválida",
                "pontos": 0
            }

        return {
            "correto": alternativa.correta,
            "pontos": pergunta.pontos if alternativa.correta else 0
        }

    # =========================
    # RESPOSTA EM TEXTO
    # =========================

    if pergunta.tipo == "texto":

        if not resposta_usuario:

            return {
                "correto": False,
                "mensagem": "Resposta vazia",
                "pontos": 0
            }

        resposta_usuario = normalizar_texto(
            resposta_usuario
        )

        respostas = RespostaAceita.query.filter_by(
            pergunta_id=pergunta_id
        ).all()

        for resposta in respostas:

            resposta_correta = normalizar_texto(
                resposta.resposta
            )

            if resposta_usuario in resposta_correta:

                return {
                    "correto": True,
                    "pontos": pergunta.pontos
                }

        return {
            "correto": False,
            "pontos": 0,
            "resposta_correta":
                respostas[0].resposta if respostas else ""
        }

    return {
        "correto": False,
        "mensagem": "Tipo de pergunta inválido",
        "pontos": 0
    }