import unicodedata

from app.models.pergunta import Pergunta
from app.models.resposta import RespostaAceita


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
            "correto": False
        }

    # VALIDA RESPOSTA VAZIA
    if not resposta_usuario:

        return {

            "correto": False,

            "mensagem":
                "Resposta vazia"
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

        # ACEITA RESPOSTA PARCIAL
        if (
            resposta_usuario
            in resposta_correta
        ):

            return {
                "correto": True,
                
                "pontos": pergunta.pontos
            }

    return {

    "correto": False,

    "pontos": 0,

    "resposta_correta":

        respostas[0].resposta

        if respostas

        else ""

}