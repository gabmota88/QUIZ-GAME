from app.database.db import db


class Partida(db.Model):

    __tablename__ = "partidas"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    rodada_atual = db.Column(
        db.Integer,
        default=1
    )

    equipe_atual = db.Column(
        db.Integer,
        default=1
    )

    status = db.Column(
        db.String(20),
        default="em_andamento"
    )

    vencedor_id = db.Column(
        db.Integer,
        nullable=True
    )