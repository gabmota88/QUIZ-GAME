from app import create_app
from app.models.categoria import Categoria

app = create_app()

with app.app_context():

    for c in Categoria.query.all():
        print(c.id, c.nome)