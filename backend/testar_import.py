# testar_import.py

import json

with open(
    "seed_questions.json",
    "r",
    encoding="utf-8"
) as f:

    dados = json.load(f)

print(dados[0].keys())