from app.database.db import db


class PerguntaUsada(db.Model):

    __tablename__ = "perguntas_usadas"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    partida_id = db.Column(
        db.Integer,
        nullable=False
    )

    pergunta_id = db.Column(
        db.Integer,
        nullable=False
    )