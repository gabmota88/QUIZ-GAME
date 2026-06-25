from app.database.db import db


class Alternativa(db.Model):

    __tablename__ = "alternativas"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    texto = db.Column(
        db.String(500),
        nullable=False
    )

    correta = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    pergunta_id = db.Column(
        db.Integer,
        db.ForeignKey("perguntas.id"),
        nullable=False
    )