import random

from app.database.db import db

from app.models.equipe import Equipe


CORES_PERMITIDAS = [

    "vermelho",
    "azul",
    "verde",
    "amarelo",
    "roxo",
    "laranja",
    "preto",
    "branco",
    "rosa",
    "ciano"

]


def criar_equipe(nome,
                 cor,
                 avatar=None):

    if not nome:

        return {
            "erro":
                "Nome obrigatório"
        }

    if not cor:

        return {
            "erro":
                "Cor obrigatória"
        }

    

    equipe_existente = Equipe.query.filter_by(
        nome=nome
    ).first()

    if equipe_existente:

        return {
            "erro":
                "Equipe já existe"
        }

    equipe = Equipe(

        nome=nome,

        cor=cor,
        
        avatar=avatar,

        pontos=0
    )

    db.session.add(equipe)

    # MUITO IMPORTANTE
    db.session.commit()

    return equipe


def sortear_ordem_equipes():

    equipes = Equipe.query.all()

    random.shuffle(equipes)

    for index, equipe in enumerate(equipes):

        equipe.ordem = index + 1

    db.session.commit()

    return equipes


def deletar_equipe(id):

    equipe = Equipe.query.get(id)

    if not equipe:

        return {
            "erro":
                "Equipe não encontrada"
        }

    db.session.delete(equipe)

    db.session.commit()

    return True