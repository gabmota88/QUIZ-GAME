from flask import Blueprint, jsonify
from app.models.pergunta import Pergunta
from app.services.question_service import buscar_pergunta_aleatoria, buscar_por_categoria, buscar_por_dificuldade
from app.models.categoria import Categoria  
from flask import request
from app.services.answer_service import validar_resposta


perguntas_bp = Blueprint(
    "perguntas",
    __name__
)

@perguntas_bp.route("/perguntas")
def listar_perguntas():
    perguntas = Pergunta.query.all()
    resultado = []
    for pergunta in perguntas:
        resultado.append({
            "id": pergunta.id,
            "texto": pergunta.texto,
            "dificuldade": pergunta.dificuldade,
            "pontos": pergunta.pontos
        })
    return jsonify(resultado)

@perguntas_bp.route("/perguntas/aleatoria")
def pergunta_aleatoria():
    pergunta = buscar_pergunta_aleatoria()

    if not pergunta:
        return jsonify({"erro": "Nenhuma pergunta encontrada."}), 404

    return {
        "id": pergunta.id,  
        "texto": pergunta.texto,
        "dificuldade": pergunta.dificuldade,
        "pontos": pergunta.pontos
    }, 200


@perguntas_bp.route("/perguntas/categoria/<categoria>")
def pergunta_categoria(categoria):
    pergunta = buscar_por_categoria(categoria)

    if not pergunta:
        return {"erro": "Categoria não encontrada."}, 404

    return {
        "texto": pergunta.texto,
        "categoria": pergunta.categoria.nome,
        "dificuldade": pergunta.dificuldade,
        "pontos": pergunta.pontos
    }, 200
    
@perguntas_bp.route(
    "/perguntas/dificuldade/<dificuldade>"
)
def pergunta_dificuldade(dificuldade):

    pergunta = buscar_por_dificuldade(
        dificuldade
    )

    if not pergunta:

        return {
            "erro": "Dificuldade não encontrada"
        }, 404

    return {
        "texto": pergunta.texto,
        "categoria": pergunta.categoria.nome,
        "dificuldade": pergunta.dificuldade,
        "pontos": pergunta.pontos
    }  


@perguntas_bp.route("/categorias")
def listar_categorias():
    categorias = Categoria.query.all()
    resultado = []
    
    for cat in categorias:
        resultado.append({
            "id": cat.id,
            "nome": cat.nome,
            "quantidade_de_perguntas": len(cat.perguntas) # Mostra quantas perguntas estão associadas
        })
        
    return jsonify(resultado)    

@perguntas_bp.route(
    "/responder",
    methods=["POST"]
)
def responder():

    dados = request.get_json()

    pergunta_id = dados.get(
        "pergunta_id"
    )

    resposta = dados.get(
        "resposta"
    )

    resultado = validar_resposta(
        pergunta_id,
        resposta
    )

    return resultado

 