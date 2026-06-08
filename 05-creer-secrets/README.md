# Démo 5 — Créer des fichiers de secrets

## 🎯 Objectif

Fabriquer **proprement** des fichiers de secrets qui seront consommés par Docker Compose dans la démo 6.

## ✋ Démarche

C'est une démo **active**. Tu fabriques les fichiers, puis la démo 6 viendra les consommer.

### Étapes à réaliser

1. **Crée un dossier de travail** (par ex. `demo-secrets/`) et place-toi dedans
2. **Crée un sous-dossier `secrets/`**
3. **Crée 3 fichiers** dans `secrets/` : `db_password.txt`, `db_user.txt`, `jwt_secret.txt` — **un secret = un fichier, une seule ligne**, pas de quote, pas de retour à la ligne final fantôme
4. **Crée un `.gitignore`** à la racine qui exclut `secrets/` (et `.env` au passage)
5. **Vérifie avec `git init` + `git add .` + `git status`** que `secrets/` n'est pas suivi

### ✅ Critère de réussite

Dans `git status` :

- `.gitignore` ✅ listé
- `secrets/` ❌ **PAS** listé

## ✋ Règle d'or

> **Un secret = un fichier, une seule ligne, pas de quote, pas de retour à la ligne final fantôme.**

## ⚠️ Piège classique

Si tu utilises `echo "password"` (double quote) avec certains shells/éditeurs, tu peux te retrouver avec :

- un BOM en début (Windows)
- des `\r\n` au lieu de `\n` (Windows)
- un `\n` final invisible

Le `.trim()` côté Node ou `trim()` côté PHP rattrape souvent le coup, mais c'est plus sain d'avoir un fichier propre dès le départ.

## 🔍 Vérification rapide

```bash
od -c secrets/db_password.txt | head -1
```

Le fichier doit finir par `\n` et c'est tout (pas `\r\n`, pas de `\0`).

## 🚀 Pour aller plus loin

1. **Crée volontairement un secret pourri** :

   ```bash
   echo "password" > secrets/bad.txt     # avec double-quotes
   od -c secrets/bad.txt
   ```

   Compare avec la version saine (`echo 'password'` ou `printf 'password'`).
2. **Sans `\n` final** : utilise `printf 'password' > secrets/clean.txt` (au lieu de `echo`). Quand est-ce utile ? (réponse : pour des secrets qui n'acceptent pas de caractère de fin, comme certaines clés API)
3. **Édition Windows piège** : ouvre `db_password.txt` dans Notepad classique, sauvegarde, refais `od -c` — tu vois apparaître `\r\n`. Préfère VS Code (mode LF) ou Notepad++.
4. **Permissions** : sur Linux/Mac, fais `chmod 600 secrets/*.txt`. Pourquoi est-ce important même si le dossier est dans `.gitignore` ?
