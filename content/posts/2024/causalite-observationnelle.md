+++
title = "Inférence causale depuis des données observationnelles en santé"
date = 2024-09-08T10:30:00+01:00
draft = false
summary = "Score de propension, variables instrumentales et graphes causaux : comment approcher la causalité quand on ne peut pas randomiser."
categories = ["Causalité"]
tags = ["causalité", "Python", "DoWhy", "épidémiologie"]
authors = ["Marie Dupont"]
+++

## La confusion entre corrélation et causalité

En épidémiologie observationnelle, les patients ne sont pas assignés aléatoirement aux traitements. Les facteurs de confusion brisent l'identifiabilité causale naïve.

## Score de propension

Le score de propension $e(X) = P(T=1|X)$ permet de construire des groupes comparables sans randomisation.

```python
from sklearn.linear_model import LogisticRegression
import pandas as pd

ps_model = LogisticRegression()
ps_model.fit(X_confounders, treatment)
propensity_scores = ps_model.predict_proba(X_confounders)[:, 1]
```

## DoWhy : causalité en Python

La librairie DoWhy permet de formaliser les hypothèses causales via un DAG, d'identifier l'estimand, puis d'estimer l'effet causal.
