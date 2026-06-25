import os
import json
import random

from app import create_app
from app.database.db import db

from app.models.categoria import Categoria
from app.models.pergunta import Pergunta
from app.models.alternativa import Alternativa


app = create_app()

PASTA_DADOS = "data"


def obter_nome_categoria(item, arquivo):

    categoria_json = item.get("categoria")

    if categoria_json:
        return categoria_json.strip()

    return (
        arquivo
        .replace(".json", "")
        .replace("_", " ")
        .title()
    )


with app.app_context():

    print("\n===== IMPORTADOR DE PERGUNTAS COM ALTERNATIVAS =====\n")

    arquivos = [

        arquivo

        for arquivo in os.listdir(PASTA_DADOS)

        if arquivo.endswith(".json")

    ]

    print(f"{len(arquivos)} arquivos encontrados")

    total_perguntas = 0
    total_ignoradas = 0

    for arquivo in arquivos:

        caminho = os.path.join(
            PASTA_DADOS,
            arquivo
        )

        with open(
            caminho,
            "r",
            encoding="utf-8"
        ) as f:

            perguntas_json = json.load(f)

        print(f"\nImportando arquivo: {arquivo}")

        for item in perguntas_json:

            categoria_nome = obter_nome_categoria(
                item,
                arquivo
            )

            # A categoria Especial terá resposta digitada.
            # Ela será importada por outro arquivo depois.
            if categoria_nome.lower() == "especial":

                print(
                    "Pergunta Especial ignorada neste importador"
                )

                total_ignoradas += 1

                continue

            pergunta_texto = item.get("pergunta")
            dificuldade = item.get("dificuldade")
            pontos = item.get("pontos", 1)
            alternativas_json = item.get("alternativas", [])

            if not pergunta_texto:

                print("Pergunta ignorada: campo 'pergunta' ausente")

                total_ignoradas += 1

                continue

            if not dificuldade:

                print(
                    f"Pergunta ignorada sem dificuldade: "
                    f"{pergunta_texto[:60]}"
                )

                total_ignoradas += 1

                continue

            if len(alternativas_json) != 4:

                print(
                    f"Pergunta ignorada: deve ter 4 alternativas -> "
                    f"{pergunta_texto[:60]}"
                )

                total_ignoradas += 1

                continue

            alternativas_corretas = [

                alternativa

                for alternativa in alternativas_json

                if alternativa.get("correta") is True

            ]

            if len(alternativas_corretas) != 1:

                print(
                    f"Pergunta ignorada: deve ter exatamente "
                    f"1 alternativa correta -> {pergunta_texto[:60]}"
                )

                total_ignoradas += 1

                continue

            categoria = Categoria.query.filter_by(
                nome=categoria_nome
            ).first()

            if not categoria:

                categoria = Categoria(
                    nome=categoria_nome
                )

                db.session.add(categoria)

                db.session.flush()

                print(
                    f"Categoria criada: {categoria_nome}"
                )

            pergunta_existente = Pergunta.query.filter_by(
                texto=pergunta_texto,
                categoria_id=categoria.id
            ).first()

            if pergunta_existente:

                print(
                    f"Pergunta já existe, ignorada: "
                    f"{pergunta_texto[:60]}"
                )

                total_ignoradas += 1

                continue

            pergunta = Pergunta(

                texto=pergunta_texto,

                dificuldade=dificuldade,

                pontos=pontos,

                categoria_id=categoria.id,

                resposta=None
            )

            db.session.add(pergunta)

            db.session.flush()

            # Embaralha antes de gravar.
            # Assim a correta não fica sempre na posição 1.
            random.shuffle(alternativas_json)

            for alternativa_json in alternativas_json:

                alternativa = Alternativa(

                    texto=alternativa_json["texto"],

                    correta=alternativa_json["correta"],

                    pergunta_id=pergunta.id
                )

                db.session.add(alternativa)

            total_perguntas += 1

        db.session.commit()

    print("\n===== IMPORTAÇÃO FINALIZADA =====")

    print(f"Perguntas importadas: {total_perguntas}")

    print(f"Perguntas ignoradas: {total_ignoradas}")