from flask import Blueprint
from flask import request
from flask import jsonify

from app.models.equipe import Equipe

from app.services.team_service import (
    criar_equipe,
    sortear_ordem_equipes,
    deletar_equipe
)

equipes_bp = Blueprint(
    "equipes",
    __name__
)


# =========================
# CRIAR EQUIPE
# =========================

@equipes_bp.route(
    "/equipes",
    methods=["POST"]
)
def cadastrar_equipe():

    dados = request.get_json()

    if not dados:

        return {
            "erro": "JSON inválido"
        }, 400

    resultado = criar_equipe(

        dados.get("nome"),

        dados.get("cor")
    )

    if isinstance(resultado, dict):

        return resultado, 400

    return jsonify({

        "id": resultado.id,

        "nome": resultado.nome,

        "cor": resultado.cor,

        "pontos": resultado.pontos

    }), 201


# =========================
# LISTAR EQUIPES
# =========================

@equipes_bp.route(
    "/equipes",
    methods=["GET"]
)
def listar_equipes():

    equipes = Equipe.query.all()

    resultado = []

    for equipe in equipes:

        resultado.append({

            "id": equipe.id,
            "nome": equipe.nome,
            "cor": equipe.cor,
            "pontos": equipe.pontos,
            "ordem": equipe.ordem
        })

    return jsonify(resultado)


# =========================
# SORTEAR ORDEM
# =========================

@equipes_bp.route(
    "/equipes/sortear-ordem"
)
def sortear_equipes():

    equipes = sortear_ordem_equipes()

    resultado = []

    for equipe in equipes:

        resultado.append({

            "id": equipe.id,

            "nome": equipe.nome,

            "cor": equipe.cor,

            "ordem": equipe.ordem,

            "pontos": equipe.pontos

        })

    return resultado,200


# =========================
# DELETAR EQUIPE
# =========================

@equipes_bp.route(
    "/equipes/<int:id>",
    methods=["DELETE"]
)
def remover_equipe(id):

    resultado = deletar_equipe(id)

    if isinstance(resultado, dict):

        return resultado, 404

    return {

        "mensagem":
            "Equipe deletada com sucesso"

    }, 200