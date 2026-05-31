from app import create_app
from app.database.db import db

app = create_app()

with app.app_context():

    db.drop_all()

    db.create_all()

    print("Banco recriado")