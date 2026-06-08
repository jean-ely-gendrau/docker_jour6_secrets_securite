# Démo 7 — User root vs non-root (CLI)

## 🎯 Objectif

Voir **concrètement** la différence entre un conteneur root (par défaut) et un conteneur non-root.

## Étape 1 — Conteneur par défaut = root

```bash
docker run --rm node:20-alpine whoami
```

Sortie : `root`

```bash
docker run --rm node:20-alpine id
```

Sortie : `uid=0(root) gid=0(root) groups=0(root)`

→ **C'est dangereux** : si une faille permet l'exécution de code arbitraire, l'attaquant a root dans le conteneur. Et selon la config (volumes montés, capabilities, etc.), il peut aussi nuire à l'hôte.

## Étape 2 — Forcer un autre utilisateur en CLI

Sans modifier l'image, juste depuis la ligne de commande :

```bash
docker run --rm --user 1000:1000 node:20-alpine id
```

Sortie : `uid=1000 gid=1000 groups=1000`

→ Plus de privilèges root.

## Étape 3 — L'impact sécurité

```bash
# En root : on peut supprimer un fichier système
docker run --rm node:20-alpine sh -c 'rm /etc/passwd && echo "GAME OVER"'

# En non-root : permission denied
docker run --rm --user 1000:1000 node:20-alpine sh -c 'rm /etc/passwd 2>&1; echo "(survécu)"'
```

## 🧠 À retenir

> **Par défaut, Docker est root-friendly. C'est pratique pour développer, catastrophique en prod.**

Mais lancer avec `--user` en CLI, c'est fragile : dès qu'on oublie le flag, on retombe en root. La vraie solution est d'inscrire l'utilisateur **dans le Dockerfile** → c'est l'objet de la démo 8.

## 🚀 Pour aller plus loin

1. **Forcer root explicitement** : `docker run --rm --user 0:0 node:20-alpine id`. Que se passe-t-il ? Pourquoi est-ce dangereux d'accepter `--user` depuis un input externe ?
2. **UID/GID hôte** : compare l'UID retourné par `docker run --rm --user 1000:1000 alpine id -u` avec ton UID sur l'hôte (`id -u` sur Linux/Mac). Sont-ils liés ? Que se passe-t-il si tu montes un volume `-v $(pwd):/data` avec différents `--user` ?
3. **Conflit UID dans Alpine** : essaye `--user 100:101` (UID/GID utilisés en interne par Alpine). Que retourne `whoami` ? (indice : Alpine a déjà des users système)
4. **Tester sur une vraie appli** : `docker run --rm --user 1000:1000 node:20-alpine npm install -g express`. Que se passe-t-il ? (souvent : permission denied car npm veut écrire dans `/usr/local`)
