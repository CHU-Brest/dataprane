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

Une ontologie est un modèle de données permettant de définir et mettre en relation des conceptes de façon standardisé dans un domaine particulier.  
Par exemple, l'ontologie de la CIM10 associe à chaque maladie un code unique qui peut être utilisé pour la codification des actes médicaux dans le cadre du PMSI.
De façon simplifié, une ontologie est une liste de tripet standardisé representé comme ceci: 

```
Sujet --Prédicat--> Object
```

Le triplet suivant par exemple signfie que le code I10 a pour label "Endocardite infectieuse"

```
I33.0 --rdfs:label--> "Endocardite infectieuse"
```

Les ontologies sont généralement sauvegarder dans des fichier rdf pouvant être télécharger.
Vous trouverez une liste complète d'ontologie médicale sur le serveur multi-terminologique de l'agence de la santé.  
Une fois télécharger, vous pouvez lire ces fichiers rdf avec des logiciels comme Protégé ou directement en python avec la librarie rdflib.

## Requêter en Sparql 

Pour explorer une ontologie, utilisez le language SparQL. Le principe est simple. Il suffit d'écrire des triplets en remplacant les inconnus par des variables.
Par exemple, la requete suivante cherche le label du code CIM10 'I33.0'.

```sparql
	  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

    SELECT ?concept ?label
    WHERE {
    ?concept skos:notation 'I33.0'.
    ?concept rdfs:label ?label.
}


```

Vous pouvez tester directement cette requête en ligne sur le serveur terminologique à l'adresse suivante: https://smt.esante.gouv.fr/sparql/



## Générer un dataframe 

Pour obtenir un beau tableau de la CIM10 avec les code, les labels, les chemin, les synonymes et les notes , vous pouvez tester le code suivant qui va extraire les données en Sparql 
pour produire un dataframe pola.rs. 

```python
import rdflib
g = rdflib.Graph()
g.parse("cim10.rdf")

query = """
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX xkos: <http://rdf-vocabulary.ddialliance.org/xkos#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX atih: <http://data.esante.gouv.fr/atih/>
SELECT ?concept ?code ?label ?path ?type ?synonymes ?inclusion_note ?exclusion_note
WHERE {
?concept rdfs:subClassOf* atih:cim10 .
?concept rdfs:label ?label.
?concept skos:notation ?code.
?concept rdfs:subClassOf+ ?superClass.
?superClass skos:notation ?path.
?concept dc:type ?type.
OPTIONAL { ?concept skos:altLabel ?synonymes. }
OPTIONAL { ?concept atih:inclusionNote ?inclusion_note . }
OPTIONAL { ?concept atih:exclusionNote ?exclusion_note . }

}
"""

records = g.query(sparql)

columns = [str(i) for i in records.vars]

recs = []
for rec in records:
    if isinstance(rec, tuple):
        recs.append(rec)
    else:
        raise TypeError("Records must contains iterable ")

df = pl.DataFrame([{str.upper(columns[i]): str(v) for i, v in enumerate(rec)} for rec in recs])

df = df.group_by("CONCEPT").agg(
        pl.col("CODE").first(),
        pl.col("CODE").first().str.replace("\.", "").alias("CODE_2"),
        pl.col("LABEL").first(),
        pl.col("PATH").reverse(),
        pl.col("SYNONYMES").drop_nulls(),
        pl.col("TYPE").first(),
        pl.col("INCLUSION_NOTE").first(),
        pl.col("EXCLUSION_NOTE").first(),
    )


print(df)

```


## En conclusion 

J'ai mis à disposition différentes requete Sparql pour d'autre ontologie. 



Très pratique pour extraire les données et les utiliser dans un tableau.

 query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX xkos: <http://rdf-vocabulary.ddialliance.org/xkos#>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX ccam: <http://data.esante.gouv.fr/cnam/ccam/>
        SELECT ?concept ?code ?label ?path ?synonyms ?topographie ?type_acte ?mode_acces
        WHERE {
        ?concept rdfs:subClassOf* ccam:Acte .
        ?concept rdfs:label ?label.
        ?concept skos:notation ?code.
        ?concept rdfs:subClassOf+ ?superClass.
        ?superClass skos:notation ?path.

        ?concept ccam:topographie ?topographieConcept.
        ?topographieConcept rdfs:label ?topographie.

        ?concept ccam:typeActe ?typeActeConcept.
        ?typeActeConcept rdfs:label ?type_acte.

        ?concept ccam:modeAcces ?modeAccesConcept.
        ?modeAccesConcept rdfs:label ?mode_acces.

        ?concept ccam:action ?actionConcept.
        ?actionConcept rdfs:label ?action.

        OPTIONAL { ?concept skos:altLabel ?synonyms. }

     }
    """

  df = df.group_by("CONCEPT").agg(
        pl.col("CODE").first(),
        pl.col("LABEL").first(),
        pl.col("PATH").reverse(),
        pl.col("SYNONYMS").drop_nulls(),
        pl.col("TOPOGRAPHIE").first(),
        pl.col("TYPE_ACTE").first(),
        pl.col("MODE_ACCES").first(),
    )



 query = """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX xkos: <http://rdf-vocabulary.ddialliance.org/xkos#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX atc: <http://data.esante.gouv.fr/whocc/atc/>
    SELECT ?concept ?code ?label ?path  ?type
    WHERE {
    ?concept rdfs:subClassOf* atc:ATC .
    ?concept rdfs:label ?label.
    ?concept skos:notation ?code.
    ?concept rdfs:subClassOf+ ?superClass.
    ?superClass skos:notation ?path.
    ?concept dc:type ?type.
    FILTER (LANG(?label) = "fr")
    }
    """


    df = df.group_by("CONCEPT").agg(
        pl.col("CODE").first(),
        pl.col("LABEL").first(),
        pl.col("PATH").reverse(),
        pl.col("TYPE").first(),
    )

    

 query = """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX xkos: <http://rdf-vocabulary.ddialliance.org/xkos#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX adicap: <https://data.esante.gouv.fr/adicap/>
    SELECT ?concept ?code ?label ?dict ?path
    WHERE {
    ?concept rdfs:subClassOf* adicap:ADICAP .
    ?concept rdfs:label ?label.
    ?concept skos:notation ?code.
    ?concept rdfs:subClassOf+ ?superClass.
        ?concept adicap:dictionaryCode ?dict.
    ?superClass skos:notation ?path.
    }
    """

  df = dataframe_from_s3_sparql(context, object_path, query)
    df = df.group_by("CONCEPT").agg(
        pl.col("CODE").first(),
        pl.col("LABEL").first(),
        pl.col("DICT").first().alias("DICT_CODE"),
        pl.col("PATH").reverse(),
    )







