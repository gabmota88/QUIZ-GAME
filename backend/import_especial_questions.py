import json
import os

from app import create_app
from app.database.db import db

from app.models.categoria import Categoria
from app.models.pergunta import Pergunta


app = create_app()

PASTA_DADOS = "data"
ARQUIVO_ESPECIAL = "especial.json"


def obter_resposta_criptografada(item):

    return (
        item.get("resposta_criptografada")
        or item.get("resposta")
        or item.get("resposta_encriptada")
    )


with app.app_context():

    print("\n===== IMPORTADOR DA CATEGORIA ESPECIAL =====\n")

    caminho = os.path.join(
        PASTA_DADOS,
        ARQUIVO_ESPECIAL
    )

    if not os.path.exists(caminho):

        print(
            f"Arquivo não encontrado: {caminho}"
        )

        raise SystemExit

    with open(
        caminho,
        "r",
        encoding="utf-8"
    ) as arquivo:

        perguntas_json = json.load(arquivo)

    if not isinstance(perguntas_json, list):

        print(
            "Erro: especial.json deve conter uma lista de perguntas."
        )

        raise SystemExit

    categoria = Categoria.query.filter(
        db.func.lower(Categoria.nome) == "especial"
    ).first()

    if not categoria:

        categoria = Categoria(
            nome="Especial"
        )

        db.session.add(categoria)

        db.session.flush()

        print("Categoria Especial criada.")

    total_importadas = 0
    total_ignoradas = 0

    for item in perguntas_json:

        if not isinstance(item, dict):

            print(
                "Item ignorado: formato inválido."
            )

            total_ignoradas += 1

            continue

        pergunta_texto = item.get(
            "pergunta"
        )

        resposta_criptografada = (
            obter_resposta_criptografada(item)
        )

        if not pergunta_texto:

            print(
                "Pergunta ignorada: campo 'pergunta' ausente."
            )

            total_ignoradas += 1

            continue

        if not resposta_criptografada:

            print(
                f"Pergunta ignorada sem resposta criptografada: "
                f"{pergunta_texto[:60]}"
            )

            total_ignoradas += 1

            continue

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

            resposta=resposta_criptografada,

            tipo="texto",

            dificuldade="especial",

            pontos=4,

            categoria_id=categoria.id
        )

        db.session.add(pergunta)

        total_importadas += 1

    db.session.commit()

    print("\n===== IMPORTAÇÃO FINALIZADA =====")

    print(
        f"Perguntas especiais importadas: "
        f"{total_importadas}"
    )

    print(
        f"Perguntas especiais ignoradas: "
        f"{total_ignoradas}"
    )