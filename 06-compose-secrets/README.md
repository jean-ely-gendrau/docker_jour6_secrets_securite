# Démo 6 — `docker-compose.yml` avec secrets

## 🎯 Objectif

Consommer les secrets créés en démo 05 de la **bonne façon** : montés en fichiers dans `/run/secrets/`, jamais exposés en variable d'environnement.

## Prérequis

La démo 5 doit être faite (le dossier `secrets/` avec `db_password.txt` et `db_user.txt`).

## 🚀 Lancer

```bash
docker compose run --rm api
```

## 👀 Sortie attendue

```bash
=== Méthode 1 : lecture directe du fichier monté ===
Password : mypassword123
User     : myappuser

=== Méthode 2 : via la variable _FILE ===
DB_PASSWORD_FILE pointe sur : /run/secrets/db_password
Contenu : mypassword123
```

## 🔍 Vérifications à faire après le lancement

```bash
# 1. Le secret EST visible DANS le conteneur (c'est normal, c'est l'objectif)
docker compose run --rm api cat /run/secrets/db_password

# 2. MAIS il n'apparaît PAS dans docker inspect
docker compose run --rm -d api sleep 30
docker inspect $(docker compose ps -q api) | grep -i password
# → seulement les variables _FILE (chemin), pas la valeur
```

```bash
# 3. Et il n'apparaît PAS non plus dans docker compose config
docker compose config | grep -i password
# → idem, juste les chemins
```

## 🧠 À retenir

- Un secret **n'est PAS une variable d'environnement classique**
- Il est monté en **lecture seule** dans `/run/secrets/`
- Le fichier sur l'hôte (`./secrets/db_password.txt`) est dans `.gitignore`
- La convention `_FILE` (`DB_PASSWORD_FILE=/run/secrets/...`) est utilisée par MySQL, Postgres, Redis, etc. — beaucoup d'images officielles savent lire un secret depuis un fichier
- En prod : un secret manager (Vault, AWS Secrets Manager, Docker Swarm secrets, Kubernetes secrets) remplace les fichiers locaux

## 🚀 Pour aller plus loin

1. **Rotation à chaud** : modifie `secrets/db_password.txt` puis relance `docker compose run --rm api`. La nouvelle valeur est-elle prise en compte ? (et avec `docker compose up` pour un service déjà démarré ?)
2. **Permissions dans le conteneur** :

   ```bash
   docker compose run --rm api ls -la /run/secrets/
   ```

   Quel propriétaire ? Quels droits ? Tente d'écrire dedans depuis le conteneur (`echo x > /run/secrets/db_password`) — que se passe-t-il ?
3. **Ajoute un 3e secret** (par ex. `jwt_secret`) dans le compose et dans le code de la commande. Vérifie qu'il est bien lu.
4. **Image officielle MySQL** : remplace `alpine` par `mysql:8` et utilise `MYSQL_ROOT_PASSWORD_FILE=/run/secrets/db_password`. Démarre, puis vérifie avec `docker exec -it <container> mysql -uroot -p` que le mot de passe est bien celui du fichier secret.
