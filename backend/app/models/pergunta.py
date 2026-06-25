from app.database.db import db


class Pergunta(db.Model):

    __tablename__ = "perguntas"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    texto = db.Column(
        db.String(1000),
        nullable=False
    )

    resposta = db.Column(
        db.String(500),
        nullable=True
    )

    tipo = db.Column(
    db.String(50),
    nullable=False,
    default="multipla_escolha"
    )

    dificuldade = db.Column(
        db.String(50),
        nullable=False
    )

    pontos = db.Column(
        db.Integer,
        default=1
    )

    categoria_id = db.Column(
        db.Integer,
        db.ForeignKey("categorias.id"),
        nullable=False
    )

    alternativas = db.relationship(
        "Alternativa",
        backref="pergunta",
        lazy="select",
        cascade="all, delete-orphan"
    )

