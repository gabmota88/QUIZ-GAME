import random
from app.models.pergunta import Pergunta
from app.models.categoria import Categoria  # 🔴 IMPORTANTE: Importar o modelo Categoria

def buscar_pergunta_aleatoria():
    perguntas = Pergunta.query.all()
    if not perguntas:
        return None
    return random.choice(perguntas)

def buscar_por_categoria(nome_categoria):
    # 🔴 CORREÇÃO AQUI: Fazemos a busca direto na tabela Categoria usando 'ilike' (ignora maiúsculas/minúsculas)
    categoria = Categoria.query.filter(Categoria.nome.ilike(nome_categoria)).first()
    
    # Se a categoria não existir no banco, já para por aqui
    if not categoria:
        return None

    # Busca as perguntas filtrando pelo ID da categoria encontrada
    perguntas = Pergunta.query.filter_by(categoria_id=categoria.id).all()

    if not perguntas:
        return None

    return random.choice(perguntas)

def buscar_por_dificuldade(dificuldade):

    dificuldade = dificuldade.lower().strip()

    perguntas = Pergunta.query.filter(
        Pergunta.dificuldade.ilike(dificuldade)
    ).all()

    if not perguntas:
        return None

    return random.choice(perguntas)