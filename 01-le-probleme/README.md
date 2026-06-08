# Démo 1 — Le problème : secrets en clair

## 🎯 Objectif

Comprendre **pourquoi** mettre des mots de passe directement dans un `docker-compose.yml` est une mauvaise idée — avant d'apprendre à faire mieux.

## 👀 Ce que tu dois regarder

Ouvre `docker-compose.yml`. Tu vois `DB_PASSWORD=Sup3rS3cr3t!2024`, `JWT_SECRET=...`, `MYSQL_ROOT_PASSWORD=root123` — tous en clair.

## 🚀 Démontrer la fuite

```bash
docker compose config | grep -i password
```

→ Tous les mots de passe s'affichent immédiatement.

## ⚠️ Ne PAS lancer `docker compose up`

C'est volontairement un anti-pattern. Les démos suivantes corrigent ça proprement.

## 🧠 À retenir

- **Git** : une fois commité, c'est dans l'historique **pour toujours** (un `git rm` ne suffit pas, il faut réécrire l'historique)
- **`docker inspect`** : expose les variables d'environnement à toute personne ayant accès au démon Docker
- **Captures d'écran, logs d'erreur, partage de fichier Slack** : tout fuit, tout le temps

## 🚀 Pour aller plus loin

1. **Simulation Git** : crée un repo de test, commit ce compose, fais un changement de mot de passe, puis tente de récupérer l'ancien :

   ```bash
   git init && git add . && git commit -m "init"
   sed -i 's/Sup3rS3cr3t!2024/NewPassword/' docker-compose.yml
   git add . && git commit -m "rotation mot de passe"
   git log -p | grep Sup3rS3cr3t
   # → L'ancien mot de passe est toujours dans l'historique
   ```

2. **Cherche en ligne** :
 tape « github secrets leak » → tu verras combien de repos publics fuitent encore aujourd'hui des AWS keys, Stripe keys, etc.
3. **Outil de détection** : regarde ce que fait `gitleaks` ou `trufflehog` — ils scannent l'historique Git pour trouver des secrets oubliés.
