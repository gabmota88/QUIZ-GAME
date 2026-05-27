import json
import os

from flask import Blueprint, jsonify

from app.database.db import db

from app.models.categoria import Categoria
from app.models.pergunta import Pergunta
from app.models.resposta import RespostaAceita


import_bp = Blueprint(
    "import_bp",
    __name__
)


@import_bp.route(
    "/importar-perguntas",
    methods=["POST"]
)
def importar_perguntas():

    caminho = os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "seed_questions.json"
    )

    caminho = os.path.abspath(caminho)

    with open(
        caminho,
        "r",
        encoding="utf-8"
    ) as arquivo:

        dados = json.load(arquivo)

    total = 0

    for item in dados:

        categoria_nome = item["categoria"]

        categoria = Categoria.query.filter_by(
            nome=categoria_nome
        ).first()

        if not categoria:

            categoria = Categoria(
                nome=categoria_nome
            )

            db.session.add(categoria)
            db.session.commit()

        pergunta = Pergunta(

            texto=item["pergunta"],

            dificuldade=item["dificuldade"],

            pontos=item["pontos"],

            categoria_id=categoria.id
        )

        db.session.add(pergunta)
        db.session.commit()

        resposta = RespostaAceita(

            resposta=item["resposta"],

            pergunta_id=pergunta.id
        )

        db.session.add(resposta)
        db.session.commit()

        total += 1

    return jsonify({
        "mensagem": "Importação concluída",
        "total": total
    })