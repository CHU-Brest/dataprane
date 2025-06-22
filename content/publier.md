---
title: 'Publier un billet'
date: 2023-10-24
type: page
---

Dataprane est un blog collaboratif construit avec le framework [Hugo](https://gohugo.io/) et
 [HugoBlox](https://docs.hugoblox.com/) qui permet de générer des pages statiques hébergées sur [GitHub](https://github.com/CHU-Brest/dataprane).
Vous pouvez ainsi facilement proposer un article en soumettant une [pull request](https://docs.github.com/fr/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests).
Il est possible de rédiger un billet directement depuis l’éditeur en ligne de GitHub.
Toutefois, nous vous recommandons vivement de tester le rendu de votre article en local avant de le soumettre.

### Prérequis

Hugo est la seule dépendance nécessaire.
L’outil est disponible sur tous les systèmes d’exploitation et peut être téléchargé à l’adresse suivante : 
[https://gohugo.io/installation/](gohugo.io)


### Forker le projet

Depuis github, faite un fork du blog situé à l'adresse suivante:

[https://github.com/CHU-Brest/dataprane](https://github.com/CHU-Brest/dataprane)

Depuis votre terminal, cloner le repository nouvellement crée et lancer le blog sur un serveur de test.
Vous devriez voir le blog sur **localhost:1313**.

```bash

git clone git@github.com:<username>/dataprane.git
cd dataframe
# installer les modules hugo
hugo mod get
# Lancer le serveur de test 
hugo serve

```

### Organisation

Un billet de blog est défini par un dossier situé dans **dataprane/content/posts/**.
Ce dossier contient :

- le contenu de votre billet au format Markdown, dans le fichier **index.md** ;
- tous les fichiers associés (images, tableaux, etc.) référencés dans votre article.


### Ecrire votre billet 
Votre billet de blog doit être écrit en markdown de la forme suivante.
Vous pouvez mettre divers options dans l'entête en suivant la spécification définie [ici](https://docs.hugoblox.com/reference/page-features/).


```md
---
title: Titre de votre billet
summary: Un résumé visible sur la page listant les billets
date: 2023-10-25
commentable: true
authors:
  - IdentifiantGithub
---

Dans ce billet de blog, nous allons étudier
les copules gaussiennes...

## Partie 1 : Base mathématique 

```

### Publier votre billet

Une fois votre billet terminé et commité sur votre branche, vous pouvez demander
une Pull request. Votre billet sera soumis à relecture et publier
sur dataprane.
