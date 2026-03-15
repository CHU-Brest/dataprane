+++
title = "NLP appliqué aux dossiers médicaux : extraction d'entités nommées"
date = 2024-10-15T14:00:00+01:00
draft = false
summary = "Comment utiliser les transformers (CamemBERT, DrBERT) pour extraire automatiquement diagnostics, médicaments et actes depuis des compte-rendus hospitaliers en français."
categories = ["NLP"]
tags = ["NLP", "Python", "transformers", "EHR"]
authors = ["Thomas Martin"]
+++

## Pourquoi le NLP médical est difficile

Les textes médicaux contiennent des abréviations non standards, des négations implicites, et un vocabulaire très spécialisé rarement couvert par les modèles génériques.

## DrBERT et CamemBERT-bio

Ces modèles pré-entraînés sur des corpus médicaux francophones améliorent significativement les performances en NER clinique.

```python
from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch

model_name = "Dr-BERT/DrBERT-7GB"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
```

## Pipeline d'extraction

1. Segmentation en phrases
2. Tokenisation sous-mots
3. Inférence NER
4. Post-traitement des entités chevauchantes
