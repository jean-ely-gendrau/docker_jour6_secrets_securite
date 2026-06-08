# Démo 2 — Les 3 méthodes côte à côte

## 🎯 Objectif

Connaître les **trois façons** de passer des variables à un conteneur, et savoir quand utiliser chacune.

---

## Méthode 1 — `environment:` (en dur dans le compose)

```bash
docker compose -f 01-methode-environment.yml run --rm api
```

Sortie attendue :

```bash
NODE_ENV=production / PORT=3000 / DEBUG=false
```

➕ Simple, visible.
➖ Pas pour les secrets (visible dans Git, dans `docker inspect`).

---

## Méthode 2 — `env_file:` (charger un fichier externe)

```bash
docker compose -f 02-methode-env-file.yml run --rm api
```

Sortie attendue :

```bash
NODE_ENV=production / PORT=3000 / DB_HOST=mysql
```

➕ Sépare config et code, le fichier `.env` peut être `.gitignored`.
➖ Reste en clair sur le disque.

---

## Méthode 3 — Interpolation `${VAR}` dans le compose

```bash
docker compose --env-file .env.interpolation -f 03-methode-interpolation.yml config
```

`config` n'exécute rien : il affiche le compose **après** interpolation. Regarde les lignes :

```docker
image: mysql:8
MYSQL_DATABASE: myapp
```

Les `${MYSQL_VERSION:-8}` et `${DB_NAME:-defaultdb}` ont été remplacés.

➕ Permet de paramétrer les versions d'image, les ports, etc.
➖ La variable doit exister à l'exécution, sinon string vide (ou valeur par défaut si tu utilises `${VAR:-default}`).

---

## 🧠 Quand utiliser quoi ?

| Méthode | Bon usage |
|---|---|
| `environment` | Config simple, jamais des secrets |
| `env_file` | Configuration multi-environnement (dev/staging/prod) |
| Interpolation `${VAR}` | Versions, ports, paramètres injectés depuis le shell ou la CI |

⚠️ **Aucune des trois n'est correcte pour des SECRETS** → on s'en occupe dans les démos 5-6.

## 🚀 Pour aller plus loin

1. **Casser la méthode 3** : supprime la valeur de `MYSQL_VERSION` dans `.env.interpolation` (laisse `MYSQL_VERSION=` vide ou commente la ligne). Relance `docker compose config`. Que prend `${MYSQL_VERSION:-8}` ?
2. **Sans valeur par défaut** : modifie le compose pour mettre juste `${MYSQL_VERSION}` (sans `:-8`). Supprime à nouveau la variable. Que se passe-t-il ?
3. **Mélange `environment` + `env_file`** : ajoute un bloc `environment:` au YAML méthode 2 avec `NODE_ENV=development`. Relance. Qui gagne ? → c'est exactement le sujet de la démo suivante.
