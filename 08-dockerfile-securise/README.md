# Démo 8 — Dockerfile sécurisé

## 🎯 Objectif

Inscrire un utilisateur non-root **dans l'image** (donc plus de risque de l'oublier au `docker run`).

## 🚀 Lancer la version sécurisée

```bash
docker build -t demo-secure -f Dockerfile .
docker run --rm demo-secure
```

Sortie attendue :

```bash
====== Identité du processus ======
Username : appuser
UID      : 100
GID      : 101
HOME     : /home/appuser
UID est root ? ✅  NON (bon)
```

## 🚀 Lancer la version NON sécurisée (pour comparer)

```bash
docker build -t demo-unsecure -f Dockerfile.unsecure .
docker run --rm demo-unsecure
```

Sortie attendue :

```bash
====== Identité du processus ======
Username : root
UID      : 0
GID      : 0
HOME     : /root
UID est root ? ⚠️  OUI (mauvais)
```

## 🧠 La recette qui marche

```dockerfile
FROM node:20-alpine
WORKDIR /app

# 1. Créer un groupe et un user dédiés
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 2. Copier le code AVEC le bon propriétaire
COPY --chown=appuser:appgroup package*.json ./
COPY --chown=appuser:appgroup server.js ./

# 3. (Optionnel : RUN npm ci --only=production en ROOT avant le USER)

# 4. Basculer sur non-root pour TOUT ce qui suit
USER appuser
CMD ["node", "server.js"]
```

## ⚠️ Pièges classiques

1. **`USER appuser` AVANT `COPY`** : le COPY échoue car `appuser` n'a pas les droits d'écrire dans `/app`.
   → toujours : créer le user, copier avec `--chown`, **puis** basculer.
2. **`RUN npm install` APRÈS `USER appuser`** : npm veut écrire dans `node_modules`, crash.
   → installer en root, puis basculer.
3. **`COPY` sans `--chown`** : les fichiers appartiennent à root. L'application non-root peut les lire (selon les droits) mais pas les modifier.

## 🚀 Pour aller plus loin

1. **Reproduire le piège 1** : déplace `USER appuser` AVANT les `COPY` dans `Dockerfile` et rebuild. Lis l'erreur attentivement.
2. **Reproduire le piège 2** : ajoute `RUN npm install --save express` après `USER appuser`. Que se passe-t-il ?
3. **Inspecter le user dans l'image** :

   ```bash
   docker run --rm demo-secure cat /etc/passwd | grep appuser
   ```

   Que signifie `/sbin/nologin` à la fin de la ligne ? (indice : empêche d'ouvrir un shell interactif avec ce compte)
4. **Override depuis le compose** : ajoute `user: "0:0"` dans un docker-compose. Est-ce que le `USER appuser` du Dockerfile résiste ? (réponse : non, le compose gagne)
5. **`docker history demo-secure`** : que vois-tu ? Toutes les commandes apparaissent — utile pour auditer une image.
