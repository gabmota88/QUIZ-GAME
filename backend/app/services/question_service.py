import random

from app.database.db import db

from app.models.pergunta import Pergunta
from app.models.categoria import Categoria
from app.models.partida import Partida
from app.models.pergunta_usada import PerguntaUsada


# =====================================
# CONTROLE DE PERGUNTAS USADAS
# =====================================

def registrar_pergunta_usada(
    partida_id,
    pergunta_id
):

    registro = PerguntaUsada(
        partida_id=partida_id,
        pergunta_id=pergunta_id
    )

    db.session.add(registro)
    db.session.commit()


def obter_ids_usados(
    partida_id
):

    usadas = PerguntaUsada.query.filter_by(
        partida_id=partida_id
    ).all()

    return [
        usada.pergunta_id
        for usada in usadas
    ]


def obter_partida_ativa():

    return Partida.query.order_by(
        Partida.id.desc()
    ).first()


# =====================================
# PERGUNTA ALEATÓRIA
# =====================================

def buscar_pergunta_aleatoria():

    partida = obter_partida_ativa()

    if not partida:
        return None

    ids_usados = obter_ids_usados(
        partida.id
    )

    perguntas = Pergunta.query.filter(
        ~Pergunta.id.in_(ids_usados)
    ).all()

    if not perguntas:
        return None

    pergunta = random.choice(
        perguntas
    )

    registrar_pergunta_usada(
        partida.id,
        pergunta.id
    )

    return pergunta


# =====================================
# POR CATEGORIA
# =====================================

def buscar_por_categoria(
    nome_categoria
):

    partida = obter_partida_ativa()

    if not partida:
        return None

    categoria = Categoria.query.filter(
        Categoria.nome.ilike(
            nome_categoria
        )
    ).first()

    if not categoria:
        return None

    ids_usados = obter_ids_usados(
        partida.id
    )

    perguntas = Pergunta.query.filter(
        Pergunta.categoria_id == categoria.id,
        ~Pergunta.id.in_(ids_usados)
    ).all()

    if not perguntas:
        return None

    pergunta = random.choice(
        perguntas
    )

    registrar_pergunta_usada(
        partida.id,
        pergunta.id
    )

    return pergunta


# =====================================
# POR DIFICULDADE
# =====================================

def buscar_por_dificuldade(
    dificuldade
):

    partida = obter_partida_ativa()

    if not partida:
        return None

    dificuldade = dificuldade.lower().strip()

    ids_usados = obter_ids_usados(
        partida.id
    )

    perguntas = Pergunta.query.filter(
        Pergunta.dificuldade.ilike(
            dificuldade
        ),
        ~Pergunta.id.in_(ids_usados)
    ).all()

    if not perguntas:
        return None

    pergunta = random.choice(
        perguntas
    )

    registrar_pergunta_usada(
        partida.id,
        pergunta.id
    )

    return pergunta


# =====================================
# CATEGORIA + DIFICULDADE
# =====================================

def buscar_por_categoria_e_dificuldade(
    categoria_id,
    dificuldade
):

    partida = obter_partida_ativa()

    if not partida:

        print("SEM PARTIDA")

        return None

    dificuldade = (
        dificuldade
        .lower()
        .strip()
    )

    ids_usados = obter_ids_usados(
        partida.id
    )

    print(
        "Perguntas usadas:",
        ids_usados
    )

    perguntas = Pergunta.query.filter(
        Pergunta.categoria_id == categoria_id,
        Pergunta.dificuldade.ilike(
            dificuldade
        ),
        ~Pergunta.id.in_(ids_usados)
    ).all()

    print(
        "Perguntas encontradas:",
        len(perguntas)
    )

    for p in perguntas:

        print(
            p.id,
            p.texto
        )

    if not perguntas:

        return None

    pergunta = random.choice(
        perguntas
    )

    registrar_pergunta_usada(
        partida.id,
        pergunta.id
    )

    return pergunta


# =====================================
# CATEGORIA ESPECIAL
# =====================================



def buscar_pergunta_especial():

    return Pergunta.query.filter_by(
        tipo="texto",
        dificuldade="especial"
    ).order_by(
        db.func.random()
    ).first()