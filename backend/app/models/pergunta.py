from app.database.db import db


class Pergunta(db.Model):
    __tablename__ = "perguntas"

    id = db.Column(db.Integer, primary_key=True)

    texto = db.Column(
        db.String(500),
        nullable=False
    )

    dificuldade = db.Column(
        db.String(20),
        nullable=False
    )

    pontos = db.Column(
        db.Integer,
        nullable=False
    )

    categoria_id = db.Column(
        db.Integer,
        db.ForeignKey("categorias.id"),
        nullable=False
    )

    respostas = db.relationship(
        "RespostaAceita",
        backref="pergunta",
        lazy=True
    )