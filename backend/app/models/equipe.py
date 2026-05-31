from app.database.db import db


class Equipe(db.Model):

    __tablename__ = "equipes"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    nome = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    cor = db.Column(
        db.String(30),
        nullable=False,
        unique=True
    )

    pontos = db.Column(
        db.Integer,
        default=0
    )

    ordem = db.Column(
        db.Integer
    )
    avatar = db.Column(
    db.String(50),
    nullable=True
)