from flask import Blueprint, request

from app.services.team_service import (
    criar_equipe,
    sortear_ordem_equipes
)


equipes_bp = Blueprint(
    "equipes",
    __name__
)


@equipes_bp.route(
    "/equipes",
    methods=["POST"]
)
def cadastrar_equipe():

    dados = request.get_json()

    resultado = criar_equipe(
        dados["nome"],
        dados["cor"]
    )

    if isinstance(resultado, dict):

        return resultado, 400

    return {
        "id": resultado.id,
        "nome": resultado.nome,
        "cor": resultado.cor,
        "pontos": resultado.pontos
    }, 201
    
@equipes_bp.route(
    "/equipes/sortear-ordem"
)
def sortear_equipes():

    equipes = sortear_ordem_equipes()

    resultado = []

    for equipe in equipes:

        resultado.append({
            "nome": equipe.nome,
            "cor": equipe.cor,
            "ordem": equipe.ordem
        })

    return resultado