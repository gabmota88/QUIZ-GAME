from flask import Flask
from flask_cors import CORS

from app.database.db import db

# Models
from app.models.categoria import Categoria
from app.models.pergunta import Pergunta
from app.models.resposta import RespostaAceita
from app.models.partida import Partida

# Routes
from app.routes.perguntas_routes import perguntas_bp
from app.routes.equipes_routes import equipes_bp
from app.routes.game_routes import game_bp


def create_app():

    app = Flask(__name__)

    # =========================
    # CONFIG BANCO
    # =========================

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///quiz.db"
    )

    app.config[
        "SQLALCHEMY_TRACK_MODIFICATIONS"
    ] = False

    # =========================
    # INICIALIZAÇÕES
    # =========================

    db.init_app(app)

    # LIBERA CORS
    CORS(app)

    # =========================
    # BLUEPRINTS
    # =========================

    app.register_blueprint(
        perguntas_bp
    )

    app.register_blueprint(
        equipes_bp
    )

    app.register_blueprint(
        game_bp
    )

    # =========================
    # CRIA TABELAS
    # =========================

    with app.app_context():

        db.create_all()

    return app