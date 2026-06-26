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

CATEGORIA_ESPECIAL = "especial"


def normalizar_categoria(nome):

    return nome.strip().lower()


def obter_nome_categoria(item, arquivo):

    categoria_json = item.get("categoria")

    if categoria_json:

        return categoria_json.strip()

    return (
        arquivo
        .replace(".json", "")
        .replace("_", " ")
        .strip()
        .title()
    )


def garantir_lista_perguntas(dados_json):

    # Caso normal:
    # [
    #   { pergunta 1 },
    #   { pergunta 2 }
    # ]

    if not isinstance(dados_json, list):

        return []

    # Caso acidental:
    # [
    #   [
    #     { pergunta 1 },
    #     { pergunta 2 }
    #   ]
    # ]

    if (
        len(dados_json) == 1
        and isinstance(dados_json[0], list)
    ):

        return dados_json[0]

    return dados_json


def buscar_ou_criar_categoria(nome_categoria):

    categoria = Categoria.query.filter(
        db.func.lower(Categoria.nome)
        == normalizar_categoria(nome_categoria)
    ).first()

    if categoria:

        return categoria

    categoria = Categoria(
        nome=nome_categoria.strip().title()
    )

    db.session.add(categoria)

    db.session.flush()

    print(f"Categoria criada: {categoria.nome}")

    return categoria


def pergunta_ja_existe(pergunta_texto, categoria_id):

    return Pergunta.query.filter_by(
        texto=pergunta_texto,
        categoria_id=categoria_id
    ).first()


def importar_pergunta_especial(item, categoria):

    pergunta_texto = item.get("pergunta")

    resposta_criptografada = (
        item.get("resposta_criptografada")
        or item.get("resposta")
    )

    if not pergunta_texto:

        print(
            "Pergunta Especial ignorada: "
            "campo 'pergunta' ausente"
        )

        return False

    if not resposta_criptografada:

        print(
            f"Pergunta Especial ignorada sem resposta: "
            f"{pergunta_texto[:60]}"
        )

        return False

    if pergunta_ja_existe(
        pergunta_texto,
        categoria.id
    ):

        print(
            f"Pergunta Especial já existe, ignorada: "
            f"{pergunta_texto[:60]}"
        )

        return False

    pergunta = Pergunta(

        texto=pergunta_texto,

        # A resposta já deve estar criptografada no JSON.
        resposta=resposta_criptografada,

        tipo="texto",

        # Especial não usa dificuldade escolhida pelo jogador.
        dificuldade="especial",

        # Regra fixa da categoria Especial.
        pontos=4,

        categoria_id=categoria.id
    )

    db.session.add(pergunta)

    print(
        f"Pergunta Especial importada: "
        f"{pergunta_texto[:60]}"
    )

    return True


def importar_pergunta_multipla_escolha(item, categoria):

    pergunta_texto = item.get("pergunta")

    dificuldade = item.get(
        "dificuldade",
        ""
    ).lower().strip()

    MAPA_PONTOS = {
        "facil": 1,
        "medio": 3,
        "dificil": 5
    }

    pontos = MAPA_PONTOS.get(
        dificuldade,
        1
    )

    alternativas_json = item.get(
        "alternativas",
        []
    )
    if not pergunta_texto:

        print(
            "Pergunta ignorada: "
            "campo 'pergunta' ausente"
        )

        return False

    if not dificuldade:

        print(
            f"Pergunta ignorada sem dificuldade: "
            f"{pergunta_texto[:60]}"
        )

        return False

    if not isinstance(alternativas_json, list):

        print(
            f"Pergunta ignorada: alternativas inválidas -> "
            f"{pergunta_texto[:60]}"
        )

        return False

    if len(alternativas_json) != 4:

        print(
            f"Pergunta ignorada: deve ter 4 alternativas -> "
            f"{pergunta_texto[:60]}"
        )

        return False

    alternativas_corretas = [

        alternativa

        for alternativa in alternativas_json

        if alternativa.get("correta") is True

    ]

    if len(alternativas_corretas) != 1:

        print(
            f"Pergunta ignorada: deve ter exatamente "
            f"1 alternativa correta -> "
            f"{pergunta_texto[:60]}"
        )

        return False

    for alternativa in alternativas_json:

        if not alternativa.get("texto"):

            print(
                f"Pergunta ignorada: alternativa sem texto -> "
                f"{pergunta_texto[:60]}"
            )

            return False

    if pergunta_ja_existe(
        pergunta_texto,
        categoria.id
    ):

        print(
            f"Pergunta já existe, ignorada: "
            f"{pergunta_texto[:60]}"
        )

        return False

    pergunta = Pergunta(

        texto=pergunta_texto,

        resposta=None,

        tipo="multipla_escolha",

        dificuldade=dificuldade,

        pontos=pontos,

        categoria_id=categoria.id
    )

    db.session.add(pergunta)

    db.session.flush()

    # Cria cópia antes de embaralhar.
    # Evita alterar os dados originais carregados do JSON.
    alternativas_embaralhadas = list(
        alternativas_json
    )

    random.shuffle(
        alternativas_embaralhadas
    )

    for alternativa_json in alternativas_embaralhadas:

        alternativa = Alternativa(

            texto=alternativa_json["texto"],

            correta=alternativa_json["correta"],

            pergunta_id=pergunta.id
        )

        db.session.add(alternativa)

    return True


with app.app_context():

    print(
        "\n===== IMPORTADOR DE PERGUNTAS =====\n"
    )

    arquivos = [

        arquivo

        for arquivo in os.listdir(PASTA_DADOS)

        if arquivo.endswith(".json")

    ]

    print(f"{len(arquivos)} arquivos encontrados")

    total_importadas = 0

    total_ignoradas = 0

    for arquivo in arquivos:

        caminho = os.path.join(
            PASTA_DADOS,
            arquivo
        )

        print(f"\nImportando arquivo: {arquivo}")

        try:

            with open(
                caminho,
                "r",
                encoding="utf-8"
            ) as f:

                dados_json = json.load(f)

            perguntas_json = garantir_lista_perguntas(
                dados_json
            )

            if not perguntas_json:

                print(
                    "Arquivo ignorado: formato inválido "
                    "ou sem perguntas"
                )

                continue

            for item in perguntas_json:

                if not isinstance(item, dict):

                    print(
                        "Item ignorado: não é um objeto JSON"
                    )

                    total_ignoradas += 1

                    continue

                categoria_nome = obter_nome_categoria(
                    item,
                    arquivo
                )

                categoria = buscar_ou_criar_categoria(
                    categoria_nome
                )

                if (
                    normalizar_categoria(categoria_nome)
                    == CATEGORIA_ESPECIAL
                ):

                    importou = importar_pergunta_especial(
                        item,
                        categoria
                    )

                else:

                    importou = (
                        importar_pergunta_multipla_escolha(
                            item,
                            categoria
                        )
                    )

                if importou:

                    total_importadas += 1

                else:

                    total_ignoradas += 1

            db.session.commit()

        except Exception as erro:

            db.session.rollback()

            print(
                f"\nERRO ao importar {arquivo}: {erro}"
            )

    print(
        "\n===== IMPORTAÇÃO FINALIZADA ====="
    )

    print(
        f"Perguntas importadas: {total_importadas}"
    )

    print(
        f"Perguntas ignoradas: {total_ignoradas}"
    )