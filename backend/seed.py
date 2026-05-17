from app import create_app
from app.database.db import db
from app.models.categoria import Categoria

app = create_app()

categorias = [
    "Filmes",
    "Series",
    "Historia",
    "One Piece",
    "Esportes",
    "Disney",
    "Paises"
]

with app.app_context():

    for nome in categorias:

        categoria = Categoria(nome=nome)

        db.session.add(categoria)

    db.session.commit()

    print("Categorias criadas!")