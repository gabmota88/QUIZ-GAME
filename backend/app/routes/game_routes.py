import math

from flask import Blueprint, request, jsonify
from app.database.db import db
from app.models.partida import Partida
from app.models.equipe import Equipe
from app.services.game_service import (
    iniciar_partida,
    jogar_turno,
    avancar_turno,
    verificar_vencedor
)

game_bp = Blueprint("game", __name__)








# =========================
# INICIAR PARTIDA
# =========================
@game_bp.route("/partida", methods=["POST"])
def criar_partida():
    dados = request.get_json()
    
    pontos_vitoria = dados.get("pontos_vitoria", 15)  # Valor padrão de 15 pontos para vitória
    
    partida = iniciar_partida(pontos_vitoria=pontos_vitoria)

    return jsonify({
        "mensagem": "Partida iniciada",
        "partida_id": partida.id,
        "pontos_vitoria": partida.pontos_vitoria,
        "rodada": partida.rodada_atual,
        "equipe_atual": partida.equipe_atual
    }), 201


# =========================
# JOGAR TURNO
# =========================
@game_bp.route("/jogar", methods=["POST"])
def jogar():

    dados = request.get_json(silent=True)

    if not dados:

        return jsonify({
            "erro": "JSON inválido"
        }), 400

    equipe_id = dados.get("equipe_id")
    pergunta_id = dados.get("pergunta_id")
    alternativa_id = dados.get("alternativa_id")
    resposta_usuario = dados.get("resposta")

    if not equipe_id or not pergunta_id:

        return jsonify({
            "erro": (
                "Campos obrigatórios ausentes "
                "(equipe_id, pergunta_id)"
            )
        }), 400

    resultado = jogar_turno(
        equipe_id=equipe_id,
        pergunta_id=pergunta_id,
        alternativa_id=alternativa_id,
        resposta_jogador=resposta_usuario
    )

    return jsonify(resultado), 200

# =========================
# ESTADO DA PARTIDA
# =========================
@game_bp.route("/partida")
def estado_partida():

    partida = Partida.query.order_by(
        Partida.id.desc()
    ).first()

    if not partida:
        return jsonify({
            "erro": "Nenhuma partida encontrada"
        }), 404

    equipe = Equipe.query.filter_by(
        ordem=partida.equipe_atual
    ).first()

    nome_equipe = (
        equipe.nome
        if equipe
        else "Equipe não encontrada"
    )

    return jsonify({
        "partida_id": partida.id,
        "rodada_atual": partida.rodada_atual,
        "equipe_atual": nome_equipe,
        "status": partida.status,
        "pontos_vitoria": partida.pontos_vitoria
    }), 200

# =========================
# PLACAR
# =========================
@game_bp.route("/placar")
def placar():
    equipes = Equipe.query.order_by(Equipe.pontos.desc()).all()
    resultado = []

    for equipe in equipes:
        resultado.append({
            "nome": equipe.nome,
            "cor": equipe.cor,
            "pontos": equipe.pontos
        })

    return jsonify(resultado), 200


# =========================
# PRÓXIMO TURNO
# =========================
@game_bp.route("/partida/proximo-turno", methods=["POST"])
def proximo_turno():
    partida = Partida.query.order_by(
        Partida.id.desc()
    ).first()

    if not partida:
        return jsonify({"erro": "Nenhuma partida encontrada"}), 404

    partida = avancar_turno(partida)
    equipe = Equipe.query.filter_by(ordem=partida.equipe_atual).first()
    nome_equipe = equipe.nome if equipe else "Equipe não encontrada"

    return jsonify({
        "rodada_atual": partida.rodada_atual,
        "proxima_equipe": nome_equipe
    }), 200


# =========================
# VEZ ATUAL
# =========================
@game_bp.route("/vez-atual")
def vez_atual():
    partida = Partida.query.first()

    if not partida:
        return jsonify({"erro": "Nenhuma partida encontrada"}), 404

    equipe = Equipe.query.filter_by(ordem=partida.equipe_atual).first()

    if not equipe:
        return jsonify({"erro": "Equipe da vez não cadastrada"}), 404

    return jsonify({
        "equipe": equipe.nome,
        "cor": equipe.cor,
        "ordem": equipe.ordem
    }), 200


# =========================
# VERIFICAR VENCEDOR
# =========================
@game_bp.route("/vencedor")
def vencedor():
    equipe = verificar_vencedor()

    if not equipe:
        return jsonify({"mensagem": "Ainda não há vencedor"}), 200

    return jsonify({
        "vencedor": equipe.nome,
        "cor": equipe.cor,
        "pontos": equipe.pontos
    }), 200
    
# =========================
# ZERAR PLACAR
# =========================    

@game_bp.route(
    "/zerar-placar",
    methods=["POST"]
)
def zerar_placar():

    equipes = Equipe.query.all()

    for equipe in equipes:

        equipe.pontos = 0

    db.session.commit()

    return {
        "mensagem":
            "Placar zerado"
    }, 200
    
    
    
  # =========================
# PONTOS PARA VITÓRIA
# =========================    

@game_bp.route(
    "/pontos-vitoria",
    methods=["POST"]
)
def pontos_vitoria():

    dados = request.get_json()

    if not dados:

        return jsonify({
            "erro": "JSON inválido"
        }), 400

    valor = dados.get(
        "pontos_vitoria"
    )

    if not valor:

        return jsonify({
            "erro":
                "pontos_vitoria obrigatório"
        }), 400

    partida = Partida.query.order_by(
        Partida.id.desc()
    ).first()

    if not partida:

        return jsonify({
            "erro":
                "Nenhuma partida ativa"
        }), 404

    partida.pontos_vitoria = int(
        valor
    )

    db.session.commit()

    return jsonify({
        "mensagem": "Pontuação de vitória atualizada",
        "pontos_vitoria": partida.pontos_vitoria
    }), 200


@game_bp.route(
    "/pontos-vitoria",
    methods=["GET"]
)
def obter_pontos_vitoria():

    partida = Partida.query.order_by(
        Partida.id.desc()
    ).first()

    if not partida:
        return jsonify({
            "pontos_vitoria": 16
        })

    return jsonify({
        "pontos_vitoria": partida.pontos_vitoria
    }), 200
# =========================
# STATUS DA CATEGORIA ESPECIAL
# =========================
@game_bp.route(
    "/categoria-especial/status",
    methods=["GET"]
)
def status_categoria_especial():

    partida = Partida.query.order_by(
        Partida.id.desc()
    ).first()

    if not partida:

        return jsonify({
            "liberada": False,
            "mensagem": "Nenhuma partida ativa"
        }), 200

    pontos_necessarios = math.ceil(
        partida.pontos_vitoria * 0.70
    )

    equipes = Equipe.query.all()

    equipe_que_liberou = None

    for equipe in equipes:

        if equipe.pontos >= pontos_necessarios:

            equipe_que_liberou = equipe

            break

    return jsonify({

        "liberada":
            equipe_que_liberou is not None,

        "pontos_vitoria":
            partida.pontos_vitoria,

        "porcentagem":
            70,

        "pontos_necessarios":
            pontos_necessarios,

        "equipe_que_liberou":
            equipe_que_liberou.nome
            if equipe_que_liberou
            else None

    }), 200



