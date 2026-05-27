import json
import os
import sys

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from dotenv import load_dotenv
from google import genai

from app import create_app
from app.database.db import db

from app.models.categoria import Categoria
from app.models.pergunta import Pergunta
from app.models.resposta import RespostaAceita


# =========================
# CARREGA .ENV
# =========================

load_dotenv()

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

if not GEMINI_API_KEY:

    raise ValueError(
        "GEMINI_API_KEY não encontrada no .env"
    )


# =========================
# CLIENT GEMINI
# =========================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =========================
# APP FLASK
# =========================

app = create_app()


# =========================
# CONFIG
# =========================

CATEGORIAS = [

    "Filmes",
    "Series",
    "Historia",
    "One Piece",
    "Esportes",
    "Disney",
    "Paises"
]

DIFICULDADES = [

    "facil",
    "medio",
    "dificil"
]

QUANTIDADE = 30


# =========================
# GERAR PERGUNTAS IA
# =========================

def gerar_perguntas_ia(
    categoria,
    dificuldade,
    quantidade
):

    prompt = f"""
    Gere {quantidade} perguntas de quiz.

    Categoria:
    {categoria}

    Dificuldade:
    {dificuldade}

    Regras:
    - Responda APENAS JSON
    - Sem markdown
    - Sem explicações
    - Linguagem PT-BR

    Formato:

    [
      {{
        "pergunta": "...",
        "resposta": "...",
        "pontos": 1
      }}
    ]

    Pontuação:
    facil = 1
    medio = 3
    dificil = 5
    """

    response = client.models.generate_content(

        model="gemini-2.5-flash",

        contents=prompt
    )

    texto = response.text

    texto = texto.replace(
        "```json",
        ""
    )

    texto = texto.replace(
        "```",
        ""
    )

    texto = texto.strip()

    return json.loads(texto)


# =========================
# SALVAR NO BANCO
# =========================

def salvar_perguntas():

    with app.app_context():

        for categoria_nome in CATEGORIAS:

            categoria = Categoria.query.filter_by(
                nome=categoria_nome
            ).first()

            if not categoria:

                categoria = Categoria(
                    nome=categoria_nome
                )

                db.session.add(categoria)

                db.session.commit()

            for dificuldade in DIFICULDADES:

                print(
                    f"\nGerando: "
                    f"{categoria_nome} - "
                    f"{dificuldade}"
                )

                try:

                    perguntas = gerar_perguntas_ia(

                        categoria_nome,
                        dificuldade,
                        QUANTIDADE
                    )

                except Exception as erro:

                    print(
                        f"ERRO em "
                        f"{categoria_nome} "
                        f"{dificuldade}"
                    )

                    print(erro)

                    continue

                for item in perguntas:

                    try:

                        pergunta = Pergunta(

                            texto=item["pergunta"],

                            dificuldade=dificuldade,

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

                    except Exception as erro_item:

                        print(
                            "Erro salvando pergunta:"
                        )

                        print(erro_item)

                        db.session.rollback()

                print(
                    f"{len(perguntas)} "
                    f"perguntas salvas."
                )


# =========================
# EXECUÇÃO
# =========================

if __name__ == "__main__":

    salvar_perguntas()