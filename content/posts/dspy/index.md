---
title: Extraire des conceptes médicaux et leurs contextes avec dspy
date: 2025-07-01
commentable: true
tags: [dspy,llm]
authors:
  - dridk
---


Très fréquement, on me demande de rechercher des compte-rendu médicaux avec une liste
de mot clef. En recherchant par exemple le mot clef "endocardite" on pourrait s'attendre
à trouver tous les patients avec cette maladie . Mais en réalité, on pourrait trouver 
egallement les phrases suivantes :

- Le patient n'a pas d'**endocardite**
- Le père du patient à une **endocardite**
- J'ai prevenu le patient du risque d'**endocardite**
- Le patient pense avoir une **endocardite**

C'est ce qui rend la recherche sur texte libre beaucoup plus difficile qu'une recherche
sur des données structurée.

Dans ce billet, nous allons voir comment les modèles de languages et la libraire dspy
peut nous aider. 

## Des modèles de langages local 

Le problème des données de santé, c'est que nous n'allons pas pouvoir utiliser
des services en lignes comme chat gpt ou claude.ai.
Nous allons utiliser ollama.sh qui permet de télécharger et faire tourner des modèles
de languages locale accessible depuis une API REST.

Pour l'installer sous linux : 

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Vous pouvez alors télécharger différents modèles que vous pourez faire tourner
selon la mémoire de votre carte graphique.
Sur mon PC , j'ai une geforce RTX 3060 avec 12Go de VRAM. 
Je télécharge le modèle deepseek-r1 à 14 milliards de paramètre et je le lance
avec cette simple commande: 

```bash
ollama run deepseek-r1:14b
```

## Exploiter le modèle avec Dspy

A partir de là, nous pourions très bien essayer de créer des prompts pour extraire
des conceptes médicaux et leurs contextes à partir d'un texte.
Même cela demande pas mal d'essaie et d'erreur pour trouver le meilleurs prompt.
Par ailleurs, qd on est programmeur c'est tellement déprimant d'écrire en language
naturel. Pour ces raisons, la librarie dspy a été crée. Cette dernière va permettre
d'exploiter un LLM sans écrire de prompt. Il suffira de décrire l'entrée et la
sortie attendu sous forme de variable en python. La librarie se chargera d'écrire le
prompt pour nous.
Voyons celà avec un exemple pour extraire des conceptes medicaux en précisant si
ils sont dans une négation ou non.

### Définition d'une maladie

Nous commençons par définir les variables que nous souhaitons extraire
en définissant une structure pydantic.

```python
from pydantic import BaseModel, Field

class Entity(BaseModel):
  """
  Description d'une maladie et de son contexte
  """
  maladie:str = Field(description="Nom de la maladie ou syndrome")
  negation:bool = Field(description="Vrai si la maladie est dans une négation")
  famille: bool = Field(description="Vrai si la maladie est dans la famille du patient")

```

Maintenant que nous avons défini la variable que nous souhaitons extraire, nous allons utiliser
dspy pour définir une Signature. C'est à partir de cette signature que dspy va générer un prompt.

```python

from dspy import Signature

class EntitySignature(Signature):

  texte: str = Input("compte rendu clinique d'un patient ")
  entites: list[Entity] = Output("Extraction des noms des maladies et de leurs contexte")


```

Et voila, il ne rest plus qu'à demander à dspy de générer un prompt, l'executer et produire
les variables python demandé




```python
texte =
"""
J'ai vu en consultation Mr XXX . Ce patient a comment antécédant une insuffance cardique. 
Il n'a pas d'hypertension arterielle ni de de syndrome coronarien
"""

model = dspy.ChainOfThough(EntitySignature)
entites = model(texte=texte).entities
for entity in entities:
  print(entity)

```

Vous pouvez afficher le prompt généré avec la commande suivante :

```python
model.inspect_history()
```

## Conclusion

Dspy est un outil vraiment chouette pour exploiter un LLM sans s'embeter avec les prompts; 

