# Démo 3 — Précédence des variables

## 🎯 Objectif

Savoir **quelle source gagne** quand une même variable est définie à plusieurs endroits.

## Le setup

- `.env` contient `NODE_ENV=development`
- `docker-compose.yml` contient `environment: NODE_ENV=production`

À ton avis, qui gagne ? Lance les trois essais ci-dessous.

---

## Essai 1 — sans rien forcer

```bash
docker compose run --rm api
```

Sortie : `NODE_ENV vaut production`
→ Le bloc `environment:` du compose gagne sur `env_file:`.

## Essai 2 — forcer en ligne de commande

```bash
docker compose run --rm -e NODE_ENV=test api
```

Sortie : `NODE_ENV vaut test`
→ La ligne de commande gagne sur tout le reste.

## Essai 3 — exporter dans le shell de l'hôte

Si le compose contenait `NODE_ENV=${NODE_ENV}` (interpolation), alors le shell hôte serait pris en compte. Mais ici `environment:` écrit la valeur en dur, donc le shell est ignoré.

---

## 🧠 Ordre de précédence (à retenir)

```bash
1. docker compose run -e VAR=val   (le plus fort)
2. environment: dans compose.yml
3. env_file: (.env)
4. ENV du Dockerfile
5. Shell de l'hôte                (le plus faible)
```

---

## ⚠️ Piège fréquent : `$` vs `$$` dans `command:`

Si tu écris naïvement dans un `command:` du compose :

```yaml
command: ["sh", "-c", "echo NODE_ENV vaut $NODE_ENV"]
```

…l'essai 1 affiche `NODE_ENV vaut development` au lieu de `production`. **Ce n'est pas un bug de précédence**, c'est une interpolation au mauvais moment.

### Pourquoi

Docker Compose fait **deux passes** sur les variables :

1. **Au parse du YAML (côté hôte)** — Compose remplace `$VAR` en utilisant :
   - les variables du shell hôte
   - le fichier `.env` du dossier (mécanisme **distinct** de la directive `env_file:`)
2. **À l'exécution (dans le conteneur)** — `sh` évalue ce qu'il reste comme `$VAR`.

Avec `$NODE_ENV`, Compose voit `NODE_ENV=development` dans `.env`, **réécrit la commande** en :

```bash
sh -c "echo NODE_ENV vaut development"
```

…et l'envoie au conteneur. Le `environment: NODE_ENV=production` est bien injecté, mais **plus personne ne le lit** : la valeur est gravée dans la string.

### La règle

| Notation | Interprété par | Quand |
|----------|----------------|-------|
| `$VAR`   | Compose (hôte) | Au parse du compose.yml |
| `$$VAR`  | `sh` (conteneur) | À l'exécution |

→ Dans une `command:` qui doit lire l'environnement **du conteneur**, toujours écrire `$$VAR`.

### Vérification rapide

```bash
docker compose config
```

Affiche le compose après interpolation : on voit immédiatement si `$NODE_ENV` a été remplacé par une valeur ou s'il reste `$NODE_ENV` (correct).

---

## 🚀 Pour aller plus loin

1. **Supprime la ligne `NODE_ENV: production`** du compose. Relance l'essai 1. Qui prend la main ? *(réponse attendue : `development`, le `.env` reprend la main)*
2. **Tente le piège** : remplace `$$NODE_ENV` par `$NODE_ENV` dans le `command:`. Relance l'essai 1. Compare avec la sortie de `docker compose config`.
3. **Force la variable depuis ton shell** :
   - PowerShell : `$env:NODE_ENV = "staging"; docker compose run --rm api`
   - Bash : `NODE_ENV=staging docker compose run --rm api`
   Que vois-tu ? Que se passe-t-il si tu retires aussi `environment:` du compose ?
