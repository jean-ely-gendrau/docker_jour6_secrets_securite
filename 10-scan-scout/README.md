# Démo 10 — Scan avec Docker Scout

## 🎯 Objectif

Trouver les vulnérabilités (CVE) d'une image Docker avec l'outil intégré à Docker Desktop.

## Prérequis

- Docker Desktop récent (Scout intégré depuis 4.17+)
- Compte Docker Hub connecté : `docker login`

## Étape 1 — Vérifier que Scout est disponible

```bash
docker scout version
```

## Étape 2 — Scan rapide d'une image "grosse"

```bash
docker scout quickview node:18
```

→ Résumé : nombre de Critical / High / Medium / Low.

## Étape 3 — Le détail des CVE

```bash
docker scout cves node:18 | head -50
```

→ Pour chaque CVE : sévérité, paquet concerné, version qui corrige.

## Étape 4 — Comparer avec Alpine : le moment "wow"

```bash
docker scout quickview node:18-alpine
```

→ Énorme différence en faveur d'Alpine (~10× moins de CVE).

## Étape 5 — Recommandations automatiques

```bash
docker scout recommendations node:18
```

→ Scout te dit explicitement « passe à node:18-alpine » ou « passe à node:20 ».

## 🧠 À retenir

> **Le choix de l'image de base = 90% de ta surface d'attaque.**
Alpine n'est pas qu'une mode, c'est aussi une décision de sécurité.

## Pas de connexion Docker Hub ?

Passe à la démo 11 (Trivy), qui marche sans compte.

## 🚀 Pour aller plus loin

1. **Comparer des bases** :

   ```bash
   docker scout quickview alpine
   docker scout quickview debian:slim
   docker scout quickview ubuntu
   ```

   Quelle base a le moins de CVE ? Pourquoi ?

2. **Format machine-lisible** :

   ```bash
   docker scout cves --format only-packages node:18 | head -20
   ```

   Pratique pour intégrer dans un script.

3. **Scan d'une de tes images perso** :
 si tu as construit une image dans un autre projet, scanne-la. Compare les CVE avec celles de l'image de base — combien viennent de toi vs combien viennent du `FROM` ?
4. **Diff entre deux versions** : `docker scout compare --to node:18-alpine node:20-alpine`. Lequel est mieux côté sécurité ?
