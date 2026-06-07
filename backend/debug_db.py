from app import create_app

from app.models.categoria import Categoria
from app.models.pergunta import Pergunta

app = create_app()

with app.app_context():

    print("\n===== DIAGNÓSTICO BANCO =====\n")

    total_categorias = Categoria.query.count()
    total_perguntas = Pergunta.query.count()

    print(f"Categorias: {total_categorias}")
    print(f"Perguntas: {total_perguntas}")

    print("\n===== CATEGORIAS =====\n")

    categorias = Categoria.query.all()

    if not categorias:
        print("Nenhuma categoria encontrada.")

    for categoria in categorias:

        print(
            f"ID={categoria.id} | "
            f"Nome={categoria.nome}"
        )

    print("\n===== PRIMEIRA PERGUNTA =====\n")

    pergunta = Pergunta.query.first()

    if pergunta:

        print(
            f"ID={pergunta.id}"
        )

        print(
            f"Texto={pergunta.texto}"
        )

        print(
            f"Categoria_ID={pergunta.categoria_id}"
        )

    else:

        print(
            "Nenhuma pergunta encontrada."
        )

    print("\n===== FIM =====\n")