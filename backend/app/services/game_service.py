from app.database.db import db

from app.models.partida import Partida
from app.models.equipe import Equipe
from app.services.answer_service import (
    validar_resposta
)

from app.models.partida import Partida




def iniciar_partida(pontos_vitoria):

    Partida.query.delete()

    db.session.commit()

    primeira_equipe = Equipe.query.filter_by(
        ordem=1
    ).first()

    if not primeira_equipe:

        raise Exception(
            "Nenhuma equipe sorteada"
        )

    partida = Partida(

        rodada_atual=1,

        equipe_atual=1,

        status="ativa",
        pontos_vitoria=pontos_vitoria
    )

    db.session.add(partida)

    db.session.commit()

    return partida

    # remove partidas antigas
    Partida.query.delete()

    db.session.commit()

    partida = Partida(

        rodada_atual=1,
        equipe_atual=1,
        status="ativa"
    )

    db.session.add(partida)

    db.session.commit()

    return partida

def avancar_turno(partida):

    equipes = Equipe.query.order_by(
        Equipe.ordem
    ).all()

    total_equipes = len(equipes)

    partida.equipe_atual += 1

    # terminou rodada
    if partida.equipe_atual > total_equipes:

        partida.equipe_atual = 1

        partida.rodada_atual += 1

    db.session.commit()

    return partida

def verificar_vencedor():

    partida = Partida.query.order_by(
        Partida.id.desc()
    ).first()
    print("PONTOS PARA A VITORIA:", partida.pontos_vitoria)

    if not partida:

        return None

    equipes = Equipe.query.all()

    for equipe in equipes:
        print(f"Equipe: {equipe.nome}, Pontos: {equipe.pontos}")

        if equipe.pontos >= partida.pontos_vitoria:
            print(f"Vencedor:{equipe.nome} com {equipe.pontos} pontos")

            return equipe

    return None

  
def adicionar_pontos(
    equipe_id,
    pontos
):

    equipe = Equipe.query.get(
        equipe_id
    )

    if not equipe:
        return None

    equipe.pontos += pontos

    db.session.commit()

    return equipe

def jogar_turno(
    equipe_id,
    pergunta_id,
    resposta_jogador
):

    partida = Partida.query.order_by(
        Partida.id.desc()
    ).first(    )

    if not partida:

        return {
            "erro": "Nenhuma partida ativa"
        }

    resultado = validar_resposta(
        pergunta_id,
        resposta_jogador
    )

    equipe = Equipe.query.get(
        equipe_id
    )

    if not equipe:

        return {
            "erro": "Equipe não encontrada"
        }

    pontos_ganhos = 0

    # acertou
    if resultado["correto"]:

        pontos_ganhos = resultado["pontos"]

        equipe.pontos += pontos_ganhos

        db.session.commit()

    # verificar vencedor
    vencedor = verificar_vencedor()

    if vencedor:

        partida.status = "finalizada"

        partida.vencedor_id = vencedor.id

        db.session.commit()

        return {
            "correto": resultado["correto"],
            "pontos_ganhos": pontos_ganhos,
            "pontuacao_total": equipe.pontos,
            "vencedor": vencedor.nome
        }

    # avança turno
    partida = avancar_turno(partida)
    db.session.refresh(partida)

    proxima_equipe = Equipe.query.filter_by(
        ordem=partida.equipe_atual
    ).first()
    print("Próxima equipe:", proxima_equipe.nome)

    return {

    "correto":
        resultado["correto"],

    "pontos_ganhos":
        pontos_ganhos,

    "pontuacao_total":
        equipe.pontos,

    "rodada_atual":
        partida.rodada_atual,

    "proxima_equipe":
        proxima_equipe.nome,

    "resposta_correta":
        resultado.get(
            "resposta_correta"
        )

}
    
    
    
