import os
import json

from app import create_app
from app.database.db import db

from app.models.categoria import Categoria
from app.models.pergunta import Pergunta
from app.models.resposta import RespostaAceita

app = create_app()

PASTA_DADOS = "data"

with app.app_context():

    print("\n===== IMPORTADOR =====\n")

    arquivos = [

        arquivo

        for arquivo in os.listdir(PASTA_DADOS)

        if arquivo.endswith(".json")

    ]

    print(
        f"{len(arquivos)} arquivos encontrados"
    )

    total_perguntas = 0

    for arquivo in arquivos:

        caminho = os.path.join(
            PASTA_DADOS,
            arquivo
        )

        categoria_nome = (
            arquivo
            .replace(".json", "")
            .replace("_", " ")
            .title()
        )

        print(
            f"\nImportando categoria: {categoria_nome}"
        )

        categoria = Categoria.query.filter_by(
            nome=categoria_nome
        ).first()

        if not categoria:

            categoria = Categoria(
                nome=categoria_nome
            )

            db.session.add(categoria)

            db.session.commit()

        with open(
            caminho,
            "r",
            encoding="utf-8"
        ) as f:

            perguntas = json.load(f)

        print(
            f"{len(perguntas)} perguntas encontradas"
        )

        for item in perguntas:

            pergunta = Pergunta(

                texto=item["pergunta"],

                dificuldade=item["dificuldade"],

                pontos=item["pontos"],

                categoria_id=categoria.id
            )

            db.session.add(pergunta)

            db.session.commit()

            respostas = item.get(
                "respostas",
                []
            )

            for resposta_texto in respostas:

                resposta = RespostaAceita(

                    resposta=resposta_texto,

                    pergunta_id=pergunta.id
                )

                db.session.add(resposta)

            db.session.commit()

            total_perguntas += 1

    print("\n===== FINALIZADO =====")

    print(
        f"{total_perguntas} perguntas importadas"
    )