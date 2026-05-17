from app.database.db import db


class Categoria(db.Model):
    __tablename__ = "categorias"

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    perguntas = db.relationship(
        "Pergunta",
        backref="categoria",
        lazy=True
    )