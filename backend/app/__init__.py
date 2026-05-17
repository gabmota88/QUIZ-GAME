from flask import Flask
from app.database.db import db
from flask import CORS

# Importando os modelos para o db.create_all() reconhecê-los
from app.models.categoria import Categoria
from app.models.pergunta import Pergunta
from app.models.resposta import RespostaAceita



# Importando o Blueprint das rotas
from app.routes.perguntas_routes import perguntas_bp
from app.routes.equipes_routes import equipes_bp
from app.models.partida import Partida
from app.routes.game_routes import game_bp
def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///quiz.db"

    # Inicializa o banco de dados no app
    db.init_app(app)

    
    app.register_blueprint(perguntas_bp)
    app.register_blueprint(equipes_bp)
    app.register_blueprint(game_bp)

    with app.app_context():
        db.create_all()

    return app