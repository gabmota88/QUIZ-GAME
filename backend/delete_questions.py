from app import create_app
from app.database.db import db
from app.models.pergunta import Pergunta
from app.models.resposta import RespostaAceita

app = create_app()

with app.app_context():
    RespostaAceita.query.delete()
    Pergunta.query.delete()
    db.session.commit()
    print("Perguntas apagadas")
    exit