---
title: Extraire des conceptes médicaux et leurs contextes
date: 2025-07-06
commentable: true
tags: [dspy,llm]
authors:
  - dridk
---

Il est très fréquent qu’on nous demande de rechercher des comptes rendus médicaux à partir d’une liste de mots-clés. Par exemple, on s’attend à identifier tous les patients atteints [d’endocardite](https://fr.wikipedia.org/wiki/Endocardite) simplement en recherchant le mot « *endocardite* ».

Mais en pratique, cette approche génère de nombreux faux positifs. On pourrait par exemple trouver les phrases suivantes:

- Le patient n’a pas d’**endocardite**
- Le père du patient a une **endocardite**
- J’ai informé le patient du risque d’**endocardite**
- Le patient pense avoir une **endocardite**

La nécessité d'interpréter le contexte rend la recherche sur texte libre très difficile. 

Dans ce billet, nous allons explorer comment les modèles de langage et la librairie **[DSPy](https://dspy.ai/)** peuvent nous aider à affiner ces recherches de manière plus intelligente et contextuelle.

## Un modèle de language local

Le principal défi avec les données de santé, c’est qu’elles sont hautement sensibles. Il est donc hors de question d’utiliser des modèles de langage en ligne comme [ChatGPT](https://openai.com/index/chatgpt/) ou [Claude.ai](https://claude.ai/), qui impliqueraient l’envoi de données vers des serveurs externes.

Pour contourner cette contrainte, nous allons utiliser [Ollama](https://ollama.com/), un outil qui permet de télécharger et exécuter localement des modèles de langage. Ollama expose une API REST simple d’utilisation, ce qui en fait une solution idéale pour intégrer des modèles LLM dans des environnements maîtrisés, tout en respectant la confidentialité des données.

Pour l'installer sous Linux: 

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Vous pouvez alors télécharger différents modèles en fonction de la mémoire de votre carte graphique.

Par exemple, sur mon PC équipé d’une GeForce RTX 3060 avec 12 Go de VRAM, je peux faire tourner le modèle [deepseek-coder:1.14b](https://ollama.com/library/deepseek-r1) que je lance avec une simple commande :

```bash
ollama run deepseek-r1:14b
```

## Exploiter le modèle avec Dspy

À partir de là, on pourrait envisager d'[écrire un prompt](https://en.wikipedia.org/wiki/Prompt_engineering) pour extraire les conceptes médicaux et leurs contextes. Cependant, cela demande souvent beaucoup d’essais et d’erreurs ce qui peut rapidement devenir fastidieux.
Et puis, soyons honnêtes : quand on est développeur, rédiger des prompts c'est super chiant...   
C’est précisément pour répondre à ce besoin que la librairie Dspy a été créée. Elle permet d’exploiter un modèle de langage sans écrire directement de prompts. Il suffit de décrire les entrées et les sorties attendues sous forme de variables en Python. DSPy se charge ensuite de générer le prompt adapté automatiquement.

Voyons cela avec un exemple : extraire des concepts médicaux à partir d’un texte libre, en précisant pour chacun si le contexte est une négation ou un antécédant familiale.  

### Définition d'une maladie

Nous commençons par définir les informations que nous souhaitons extraire à partir d’un compte rendu médical, en créant une structure à l’aide de [Pydantic](https://docs.pydantic.dev/latest/). Cette structure représentera une entité médicale avec son contexte :

```python
from pydantic import BaseModel, Field

class Maladie(BaseModel):
  """
  Description d'une maladie et de son contexte
  """
  maladie:str = Field(description="Nom de la maladie ou syndrome")
  negation:bool = Field(description="Vrai si la maladie est dans une négation")
  famille: bool = Field(description="Vrai si la maladie est dans la famille du patient")

```

### Définition de la signature DSPy

Maintenant que nous avons défini le format de sortie souhaité, nous allons utiliser DSPy pour créer une [Signature](https://dspy.ai/learn/programming/signatures/). Celle-ci décrit la tâche que le modèle doit accomplir à partir d'entrée et de sortie, et sera utilisée par DSPy pour générer automatiquement le prompt :

```python
import dspy

class MaladieDetectionSignature(dspy.Signature):
    """
    Extraction des maladies à partir d'un compte-rendu clinique. 
    """
    text : str = dspy.InputField(desc="Un compte-rendu clinique")
    maladies : list[Maladie] = dspy.OutputField(desc="Une liste de maladie extraite depuis le compte-rendu")



```
Et voila, il ne rest plus qu'à demander à dspy de générer un prompt et l'executer pour produire les variables python demandées:

```python

# Configuration de dspy avec ollama 
lm = dspy.LM(
	"ollama_chat/deepseek-r1:14b", 
	api_base="http://localhost:11434",
	api_key="")
dspy.configure(lm=lm)

# Compte-rendu médical
text = """
J'ai vu en consultation Mr Claude pour une endocardite compliqué d'une septicémie.
Ce patient n'a pas de diabète ni d'hypertension arterielle. Son père à eu un infarctus du myocarde. 
"""

# Demande à dspy de créer un prompt de type "chaine de pensée" à partir 
# de la signature 
model = dspy.ChainOfThought(MaladieDetectionSignature)

# Extraction des maladies
maladies = model(text=text).maladies

print(maladies)

```

On obtient  par magie la liste des maladies et leurs contextes accessible facillement en python:

```json
{"nom":"endocardite","negation":false,"famille":false}
{"nom":"septicémie","negation":false,"famille":false}
{"nom":"diabète","negation":true,"famille":false}
{"nom":"hypertension artérielle","negation":true,"famille":false}
{"nom":"infarctus du myocarde","negation":false,"famille":true}
``` 

Vous pouvez voir le prompt généré avec cette méthode **model.inspect_history()**.

```
[2025-07-06T21:13:41.208604]

System message:

Your input fields are:
1. `text` (str): Un compte-rendu clinique
Your output fields are:
1. `reasoning` (str): 
2. `maladies` (list[Maladie]): Une liste de maladie extraite depuis le compte-rendu
All interactions will be structured in the following way, with the appropriate values filled in.

[[ ## text ## ]]
{text}

[[ ## reasoning ## ]]
{reasoning}

[[ ## maladies ## ]]
{maladies}        # note: the value you produce must adhere to the JSON schema: {"type": "array", "$defs": {"Maladie": {"type": "object", "description": "Une maladie associé à son contexte. \nSi la maladie est dans une négation ou dans un antécédant familliale.", "properties": {"famille": {"type": "boolean", "description": "Vrai si la maladie est présent dans la famille", "title": "Famille"}, "negation": {"type": "boolean", "desciption": "Vrai si la maladie est dans une négation", "title": "Negation"}, "nom": {"type": "string", "description": "Nom de la maladie ou du syndrome", "title": "Nom"}}, "required": ["nom", "negation", "famille"], "title": "Maladie"}}, "items": {"$ref": "#/$defs/Maladie"}}

[[ ## completed ## ]]
In adhering to this structure, your objective is: 
        Extraction des maladies à partir d'un compte-rendu clinique.


User message:

[[ ## text ## ]]

J'ai vu en consultation Mr Claude pour une endocardite compliqué d'une septicémie.
Ce patient n'a pas de diabète ni d'hypertension arterielle. Son père à eu un infarctus du myocarde. 


Respond with the corresponding output fields, starting with the field `[[ ## reasoning ## ]]`, then `[[ ## maladies ## ]]` (must be formatted as a valid Python list[Maladie]), and then ending with the marker for `[[ ## completed ## ]]`.
```



## Conclusion
Vous pouvez retrouver l’intégralité du code présenté [ici](https://gist.github.com/dridk/bb9665f6ec2c89835193b43b8bf9b33f) .

DSPy est un outil vraiment agréable à utiliser pour exploiter des modèles de langage sans avoir à coder manuellement des prompts complexes.
Il est également possible d’aller bien plus loin en réalisant par exemple du [fine-tuning](https://dspy.ai/tutorials/classification_finetuning/) avec du [few-shot learning](https://dspy.ai/learn/optimization/optimizers/?h=shot+learning#automatic-few-shot-learning) pour adapter le comportement du modèle à vos cas d’usage spécifiques.    
Après ça reste toujours des modèles génératives avec une part d'aléatoire, donc faite attention. 


