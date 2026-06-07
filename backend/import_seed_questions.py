import json

from app import create_app
from app.database.db import db

from app.models.categoria import Categoria
from app.models.pergunta import Pergunta
from app.models.resposta import RespostaAceita

app = create_app()

ARQUIVO_JSON = "seed_questions.json"

with app.app_context():

    print("Lendo arquivo...")

    with open(
        ARQUIVO_JSON,
        "r",
        encoding="utf-8"
    ) as f:

        perguntas_json = json.load(f)

    print(
        f"{len(perguntas_json)} perguntas encontradas"
    )

    # limpa perguntas antigas

    RespostaAceita.query.delete()
    Pergunta.query.delete()

    db.session.commit()

    print("Perguntas antigas removidas")

    total_importadas = 0

    for item in perguntas_json:

        categoria_nome = item["categoria"]

        categoria = Categoria.query.filter_by(
            nome=categoria_nome
        ).first()

        if not categoria:

            print(
                f"Categoria não encontrada: {categoria_nome}"
            )

            continue

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

        total_importadas += 1

    print(
        f"\n{total_importadas} perguntas importadas com sucesso!"
    )