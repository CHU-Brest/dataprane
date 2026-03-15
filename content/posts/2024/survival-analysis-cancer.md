+++
title = "Analyse de survie en oncologie : méthodes et pièges courants"
date = 2024-11-20T09:00:00+01:00
draft = false
summary = "Du modèle de Kaplan-Meier aux modèles de Cox, un tour d'horizon des méthodes d'analyse de survie appliquées aux données cliniques en oncologie."
categories = ["Biostatistiques"]
tags = ["survie", "R", "oncologie", "Cox"]
authors = ["Marie Dupont"]
+++

## Introduction

L'analyse de survie est une famille de méthodes statistiques destinée à modéliser le délai jusqu'à la survenue d'un événement d'intérêt — typiquement le décès, la rechute, ou la rémission.

## La méthode de Kaplan-Meier

L'estimateur de Kaplan-Meier est non-paramétrique : il ne suppose aucune forme particulière pour la distribution des temps de survie.

```r
library(survival)
library(survminer)

fit <- survfit(Surv(time, status) ~ treatment, data = lung)
ggsurvplot(fit, data = lung, pval = TRUE)
```

## Le modèle de Cox

Le modèle de Cox (ou modèle à risques proportionnels) est semi-paramétrique : il modélise le hazard en fonction des covariables sans supposer de forme paramétrique pour le hazard de base.

$$h(t|X) = h_0(t) \cdot \exp(\beta^T X)$$

## Pièges courants

- **Compétition de risques** : ignorer les événements compétitifs surestime les probabilités cumulées
- **Hypothèse de proportionnalité** : toujours vérifier avec les résidus de Schoenfeld
- **Censure informative** : quand la sortie d'étude est liée au pronostic
