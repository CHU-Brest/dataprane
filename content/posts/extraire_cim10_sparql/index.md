---
title: Extraction de la CIM10 en SparQL
date: 2025-06-23
commentable: true
authors:
  - dridk
---

Dans ce billet de blog, nous allons voir comment extraire les codes de la CIM10 depuis un 
fichier RDF en utilisant le language SparQL. Nous écrire un programme en python qui fait l'extraction puis sauvegarde les colonnes pertinantes dans un fichier parquet.


## C'est quoi une ontologie ? 

Une ontologie permet de representer et mettre en relation de façon standard des concepts.
Par exemple, l'ontologie de la CIM10 donne à chaque maladie un code unique. Ces codes sont par exemple utilisé dans la codification des actes médicaux dans le cadre du PMSI.
De façon simplifié, une ontologie est une liste de tripet representé sous forme de : 

```
Sujet --Prédicat--> Object
```

Par exemple, le triplet suivant signfie que le code I10 a pour label "Endocardite"

```
I10 --rdf:Label--> "Endocardite"
```


Les ontologies sont généralement sauvegarder dans des fichier rdf et peuvent être explorer 
avec des logiciels comme Protegé. 


## Requêter en Sparql 

Pour explorer les ontologies, on peut se servir du language SparQL. Il suffit de d'écrire les triplets et remplacer les valeurs que l'on cherche par une variable. 
Par exemple, la requete suivante cherche le code CIM10 ayant pour label "Endocardite".

```sparql
SELECT ?code 
?code rdf:label "endocardite"

```

Bien entendu, le language permet de faire bien plus et vous trouverez la spécification du langauge ici. 


## Serveur terminologique 

Plusieurs ontologie dans le domaine de la santé sont disponible en téléchargement sur le serveur multiterminologique. Il est egallement possible de requête en ligne directement. 
Par exemple pour faire la requête vu ci-dessus, rendez vous sur xxx : 




## Générer un dataframe 

Nous allons maintenant télécharger le fichier RDF de la CIM10 à l'adresse suivante. 
Pour lire ce fichier vous aurez besoin de la librarie rdflib ainsi que pola.rs pour générer le tableau. 
Le code suivant extrait les codes CIM10 avec leurs label, leurs parents, ...  . 


```python
import rdflib

```


## En conclusion 

Très pratique pour extraire les données et les utiliser dans un tableau.











