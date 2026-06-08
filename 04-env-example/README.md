# Démo 4 — `.env` et `.env.example`

## 🎯 Objectif

Appliquer la convention `.env` (valeurs réelles, gitignored) + `.env.example` (template commité) qu'on retrouve dans **tous les projets sérieux**.

## ✋ Démarche

C'est une démo **active** : tu fabriques le projet à la main pour que le réflexe rentre.

### Étapes à réaliser

1. **Crée un dossier de travail** (par ex. `demo-env/`) et place-toi dedans
2. **Crée un fichier `.env`** contenant au moins 2 **vraies valeurs** sensibles (par ex. `DB_PASSWORD=secret123`, `API_KEY=sk-live-xyz`)
3. **Crée un fichier `.env.example`** contenant les **mêmes clés** mais avec des valeurs factices (`your_password_here`, `your_api_key_here`)
4. **Crée un `.gitignore`** qui exclut `.env`
5. **Initialise un dépôt git** (`git init`), ajoute les fichiers (`git add .`) puis lance `git status`

### ✅ Critère de réussite

Dans la sortie de `git status`, tu dois voir :
- `.env.example` ✅ listé dans "to be committed"
- `.gitignore` ✅ listé
- `.env` ❌ **PAS** listé (c'est le but)

## 🧠 La règle d'or

- `.env`         → vraies valeurs → **jamais commité**
- `.env.example` → placeholders → **toujours commité**
- `.gitignore`   → contient `.env`

À l'arrivée d'un nouveau dev sur le projet : `cp .env.example .env` puis il remplit ses propres valeurs.

> **Le `.env.example` est la documentation de tes variables, sans divulguer leurs valeurs.**

## 🚀 Pour aller plus loin

1. **Oublier une variable** : supprime une ligne dans ton `.env` mais laisse-la dans `.env.example`. Lance un `docker compose up` qui utilise cette variable — que se passe-t-il ? (souvent : valeur vide silencieuse, bug en prod)
2. **Forcer un commit du `.env`** : tente `git add -f .env` puis `git status`. Le `.gitignore` ne te protège pas si tu insistes — c'est un garde-fou, pas un cadenas.
3. **Outil de garde-fou supplémentaire** : installe le hook `pre-commit` de `gitleaks` ou `git-secrets` pour bloquer automatiquement les commits contenant des patterns suspects (clés AWS, tokens GitHub, etc.).
4. **Variante multi-environnements** : crée `.env.dev`, `.env.staging`, `.env.prod`. Lance Docker Compose avec `--env-file .env.staging`. Quelle variable lit-il ?
