from flask import Blueprint, jsonify, request

from app.models.pergunta import Pergunta
from app.models.categoria import Categoria

from app.services.question_service import (
    buscar_pergunta_aleatoria,
    buscar_por_categoria,
    buscar_por_dificuldade,
    buscar_por_categoria_e_dificuldade
)

from app.services.answer_service import validar_resposta


perguntas_bp = Blueprint(
    "perguntas",
    __name__
)


# =====================================
# SERIALIZAÇÃO
# =====================================

def montar_alternativas(pergunta):

    return [

        {
            "id": alternativa.id,
            "texto": alternativa.texto
        }

        for alternativa in pergunta.alternativas

    ]


def serializar_pergunta(pergunta):

    dados = {
        "id": pergunta.id,
        "texto": pergunta.texto,
        "categoria": pergunta.categoria.nome,
        "dificuldade": pergunta.dificuldade,
        "tipo": pergunta.tipo,
        "pontos": pergunta.pontos
    }

    if pergunta.tipo == "multipla_escolha":

        dados["alternativas"] = [

            {
                "id": alternativa.id,
                "texto": alternativa.texto
            }

            for alternativa in pergunta.alternativas
        ]

    return dados

    

# =====================================
# LISTAR TODAS AS PERGUNTAS
# =====================================

@perguntas_bp.route(
    "/perguntas",
    methods=["GET"]
)
def listar_perguntas():

    perguntas = Pergunta.query.all()

    resultado = [

        serializar_pergunta(
            pergunta
        )

        for pergunta in perguntas

    ]

    return jsonify(resultado), 200


# =====================================
# PERGUNTA ALEATÓRIA
# =====================================

@perguntas_bp.route(
    "/perguntas/aleatoria",
    methods=["GET"]
)
def pergunta_aleatoria():

    pergunta = buscar_pergunta_aleatoria()

    if not pergunta:

        return jsonify({
            "erro":
                "Nenhuma pergunta encontrada."
        }), 404

    return jsonify(
        serializar_pergunta(
            pergunta
        )
    ), 200


# =====================================
# PERGUNTA POR CATEGORIA
# =====================================

@perguntas_bp.route(
    "/perguntas/categoria/<categoria>",
    methods=["GET"]
)
def pergunta_categoria(categoria):

    pergunta = buscar_por_categoria(
        categoria
    )

    if not pergunta:

        return jsonify({
            "erro":
                "Nenhuma pergunta encontrada para esta categoria."
        }), 404

    return jsonify(
        serializar_pergunta(
            pergunta
        )
    ), 200


# =====================================
# PERGUNTA POR DIFICULDADE
# =====================================

@perguntas_bp.route(
    "/perguntas/dificuldade/<dificuldade>",
    methods=["GET"]
)
def pergunta_dificuldade(dificuldade):

    pergunta = buscar_por_dificuldade(
        dificuldade
    )

    if not pergunta:

        return jsonify({
            "erro":
                "Nenhuma pergunta encontrada para esta dificuldade."
        }), 404

    return jsonify(
        serializar_pergunta(
            pergunta
        )
    ), 200


# =====================================
# PERGUNTA POR CATEGORIA + DIFICULDADE
# =====================================

@perguntas_bp.route(
    "/perguntas/sorteio",
    methods=["POST"]
)
def pergunta_categoria_dificuldade():

    dados = request.get_json()

    if not dados:

        return jsonify({
            "erro": "JSON inválido"
        }), 400

    categoria_id = dados.get(
        "categoria_id"
    )

    dificuldade = dados.get(
        "dificuldade"
    )

    especial_liberada = dados.get(
        "especial_liberada",
        False
    )

    if not categoria_id:

        return jsonify({
            "erro": "categoria_id obrigatório"
        }), 400

    categoria = Categoria.query.get(
        categoria_id
    )

    if not categoria:

        return jsonify({
            "erro": "Categoria não encontrada"
        }), 404

    # =========================
    # CATEGORIA ESPECIAL
    # =========================

    if categoria.nome.lower() == "especial":

        if not especial_liberada:

            return jsonify({
                "erro":
                    "A categoria Especial ainda não foi desbloqueada."
            }), 403

        pergunta = Pergunta.query.filter_by(
            categoria_id=categoria.id
        ).order_by(
            db.func.random()
        ).first()

        if not pergunta:

            return jsonify({
                "erro":
                    "Nenhuma pergunta especial encontrada."
            }), 404

        return jsonify(
            serializar_pergunta(
                pergunta
            )
        ), 200

    # =========================
    # CATEGORIAS NORMAIS
    # =========================

    if not dificuldade:

        return jsonify({
            "erro":
                "dificuldade obrigatória"
        }), 400

    pergunta = buscar_por_categoria_e_dificuldade(
        categoria_id,
        dificuldade
    )

    if not pergunta:

        return jsonify({
            "erro":
                "Nenhuma pergunta encontrada"
        }), 404

    return jsonify(
        serializar_pergunta(
            pergunta
        )
    ), 200

# =====================================
# LISTAR CATEGORIAS
# =====================================

@perguntas_bp.route(
    "/categorias",
    methods=["GET"]
)
def listar_categorias():

    categorias = Categoria.query.all()

    resultado = [

        {
            "id": categoria.id,

            "nome": categoria.nome,

            "quantidade_de_perguntas":
                len(categoria.perguntas)
        }

        for categoria in categorias

    ]

    return jsonify(resultado), 200


# ==============================================================
# VALIDAR RESPOSTA POR ALTERNATIVA E VALIDAR RESPOSTA POR TEXTO 
# ==============================================================

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

    pergunta_id = dados.get("pergunta_id")

    if not pergunta_id:
        return jsonify({
            "erro": "Pergunta não enviada"
        }), 400

    pergunta = Pergunta.query.get(pergunta_id)

    if not pergunta:
        return jsonify({
            "erro": "Pergunta não encontrada"
        }), 404

    if pergunta.tipo == "multipla_escolha":

        alternativa_id = dados.get("alternativa_id")

        if not alternativa_id:
            return jsonify({
                "erro": "Alternativa não enviada"
            }), 400

        resultado = validar_resposta(
            pergunta_id,
            alternativa_id
        )

        return jsonify(resultado)

    if pergunta.tipo == "texto":

        resposta = dados.get("resposta")

        if not resposta:
            return jsonify({
                "erro": "Resposta vazia"
            }), 400

        resultado = validar_resposta(
            pergunta_id,
            resposta
        )

        return jsonify(resultado)

    return jsonify({
        "erro": "Tipo de pergunta inválido"
    }), 400