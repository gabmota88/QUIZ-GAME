from flask import Blueprint
from flask import jsonify
from flask import request

from app.models.pergunta import Pergunta
from app.models.categoria import Categoria

from app.services.question_service import (
    buscar_pergunta_aleatoria,
    buscar_por_categoria,
    buscar_por_dificuldade
)

from app.services.answer_service import (
    validar_resposta
)

perguntas_bp = Blueprint(
    "perguntas",
    __name__
)


# =========================
# LISTAR TODAS
# =========================

@perguntas_bp.route("/perguntas")
def listar_perguntas():

    perguntas = Pergunta.query.all()

    resultado = []

    for pergunta in perguntas:

        resultado.append({

            "id": pergunta.id,

            "texto": pergunta.texto,

            "categoria":
                pergunta.categoria.nome,

            "dificuldade":
                pergunta.dificuldade,

            "pontos":
                pergunta.pontos
        })

    return jsonify(resultado)


# =========================
# PERGUNTA ALEATÓRIA
# =========================

@perguntas_bp.route(
    "/perguntas/aleatoria"
)
def pergunta_aleatoria():

    pergunta = buscar_pergunta_aleatoria()

    if not pergunta:

        return jsonify({
            "erro":
                "Nenhuma pergunta encontrada."
        }), 404

    return jsonify({

        "id": pergunta.id,

        "texto":
            pergunta.texto,

        "categoria":
            pergunta.categoria.nome,

        "dificuldade":
            pergunta.dificuldade,

        "pontos":
            pergunta.pontos

    })


# =========================
# POR CATEGORIA
# =========================

@perguntas_bp.route(
    "/perguntas/categoria/<categoria>"
)
def pergunta_categoria(categoria):

    pergunta = buscar_por_categoria(
        categoria
    )

    if not pergunta:

        return jsonify({
            "erro":
                "Categoria não encontrada."
        }), 404

    return jsonify({

        "id": pergunta.id,

        "texto":
            pergunta.texto,

        "categoria":
            pergunta.categoria.nome,

        "dificuldade":
            pergunta.dificuldade,

        "pontos":
            pergunta.pontos

    })


# =========================
# POR DIFICULDADE
# =========================

@perguntas_bp.route(
    "/perguntas/dificuldade/<dificuldade>"
)
def pergunta_dificuldade(dificuldade):

    pergunta = buscar_por_dificuldade(
        dificuldade
    )

    if not pergunta:

        return jsonify({
            "erro":
                "Dificuldade não encontrada"
        }), 404

    return jsonify({

        "id": pergunta.id,

        "texto":
            pergunta.texto,

        "categoria":
            pergunta.categoria.nome,

        "dificuldade":
            pergunta.dificuldade,

        "pontos":
            pergunta.pontos

    })


# =========================
# LISTAR CATEGORIAS
# =========================

@perguntas_bp.route("/categorias")
def listar_categorias():

    categorias = Categoria.query.all()

    resultado = []

    for cat in categorias:

        resultado.append({

            "id": cat.id,

            "nome": cat.nome,

            "quantidade_de_perguntas":
                len(cat.perguntas)

        })

    return jsonify(resultado)


# =========================
# VALIDAR RESPOSTA
# =========================

@perguntas_bp.route(
    "/responder",
    methods=["POST"]
)
def responder():

    dados = request.get_json()

    if not dados:

        return jsonify({
            "erro": "JSON inválido"
        }), 400

    pergunta_id = dados.get(
        "pergunta_id"
    )

    resposta = dados.get(
        "resposta"
    )

    if not pergunta_id:

        return jsonify({
            "erro":
                "Pergunta não enviada"
        }), 400

    if not resposta:

        return jsonify({
            "erro":
                "Resposta vazia"
        }), 400

    resultado = validar_resposta(
        pergunta_id,
        resposta
    )

    return jsonify(resultado)