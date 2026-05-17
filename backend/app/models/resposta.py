from app.database.db import db


class RespostaAceita(db.Model):
    __tablename__ = "respostas_aceitas"

    id = db.Column(db.Integer, primary_key=True)

    resposta = db.Column(
        db.String(300),
        nullable=False
    )

    pergunta_id = db.Column(
        db.Integer,
        db.ForeignKey("perguntas.id"),
        nullable=False
    )