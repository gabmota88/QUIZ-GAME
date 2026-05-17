import random

from app.database.db import db
from app.models.equipe import Equipe


CORES_DISPONIVEIS = [
    "vermelho",
    "azul",
    "verde",
    "preto"
]


def criar_equipe(
    nome,
    cor
):

    cor = cor.lower()

    if cor not in CORES_DISPONIVEIS:

        return {
            "erro": "Cor inválida"
        }

    equipe_existente = Equipe.query.filter_by(
        cor=cor
    ).first()

    if equipe_existente:

        return {
            "erro": "Cor já utilizada"
        }

    equipe = Equipe(
        nome=nome,
        cor=cor
    )

    db.session.add(equipe)

    db.session.commit()

    return equipe

def sortear_ordem_equipes():

    equipes = Equipe.query.all()

    random.shuffle(equipes)

    for i, equipe in enumerate(equipes):

        equipe.ordem = i + 1

    db.session.commit()

    return equipes