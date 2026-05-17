import os
import json

from app import create_app
from app.database.db import db

from app.models.categoria import Categoria
from app.models.pergunta import Pergunta
from app.models.resposta import RespostaAceita

app = create_app()

PASTA_DATA = os.path.join(os.path.dirname(__file__), "data")

with app.app_context():

    arquivos = os.listdir(PASTA_DATA)

    for arquivo in arquivos:

        # ignora arquivos que não sejam json
        if not arquivo.endswith(".json"):
            continue

        caminho_arquivo = os.path.join(PASTA_DATA, arquivo)

        with open(caminho_arquivo, "r", encoding="utf-8") as f:
            perguntas_json = json.load(f)

        # 🔴 CORREÇÃO AQUI: Remove o .json, troca sublinhado por espaço e deixa as primeiras letras maiúsculas
        # "one_piece.json" vira "One Piece"
        nome_categoria = arquivo.replace(".json", "").replace("_", " ").title()

        categoria = Categoria.query.filter_by(
            nome=nome_categoria
        ).first()

        if not categoria:
            # 🔴 DICA: Deixei esse print mais visível para você notar se ele ignorar alguma outra categoria
            print(f"⚠️ AVISO: Categoria '{nome_categoria}' não encontrada no banco. Pulando arquivo...")
            continue

        print(f"\nImportando {arquivo} (Categoria: {nome_categoria})...")

        for item in perguntas_json:

            pergunta = Pergunta(
                texto=item["pergunta"],
                dificuldade=item["dificuldade"],
                pontos=item["pontos"],
                categoria_id=categoria.id
            )

            db.session.add(pergunta)
            db.session.commit()

            for resposta_texto in item["respostas"]:

                resposta = RespostaAceita(
                    resposta=resposta_texto,
                    pergunta_id=pergunta.id
                )

                db.session.add(resposta)

            db.session.commit()
            print(f"  -> Pergunta importada: {pergunta.texto}")

    print("\nImportação finalizada!")