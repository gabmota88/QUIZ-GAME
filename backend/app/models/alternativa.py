from app.database.db import db


class Alternativa(db.Model):

    __tablename__ = "alternativas"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    pergunta_id = db.Column(
        db.Integer,
        db.ForeignKey("perguntas.id"),
        nullable=False
    )

    texto = db.Column(
        db.String(500),
        nullable=False
    )

    correta = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    pergunta = db.relationship(
        "Pergunta",
        backref=db.backref(
            "alternativas",
            lazy=True,
            cascade="all, delete-orphan"
        )
    )