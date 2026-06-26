from app.models.pergunta import Pergunta
from app.models.alternativa import Alternativa


def validar_resposta(
    pergunta_id,
    alternativa_id=None,
    resposta_usuario=None
):

    pergunta = Pergunta.query.get(pergunta_id)

    if not pergunta:

        return {
            "correto": False,
            "mensagem": "Pergunta não encontrada",
            "pontos": 0
        }

    # =========================
    # PERGUNTA DE ALTERNATIVAS
    # =========================
    if pergunta.tipo == "multipla_escolha":

        if not alternativa_id:

            return {
                "correto": False,
                "mensagem": "Alternativa não enviada",
                "pontos": 0
            }

        alternativa = Alternativa.query.filter_by(
            id=alternativa_id,
            pergunta_id=pergunta_id
        ).first()

        if not alternativa:

            return {
                "correto": False,
                "mensagem": "Alternativa inválida para esta pergunta",
                "pontos": 0
            }

        if alternativa.correta:

            return {
                "correto": True,
                "pontos": pergunta.pontos
            }

        alternativa_correta = Alternativa.query.filter_by(
            pergunta_id=pergunta_id,
            correta=True
        ).first()

        return {
            "correto": False,
            "pontos": 0,
            "resposta_correta": (
                alternativa_correta.texto
                if alternativa_correta
                else ""
            )
        }

    # A categoria Especial será implementada na próxima etapa.
    return {
        "correto": False,
        "mensagem": "Tipo de pergunta ainda não suportado",
        "pontos": 0
    }