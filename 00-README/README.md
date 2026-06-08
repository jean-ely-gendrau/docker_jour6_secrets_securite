# 🎬 Démos — Jour 6 : Secrets & Sécurité Docker

Un dossier = une démo. Chaque démo a son propre `README.md` avec l'objectif, les commandes à lancer, ce que tu dois observer, et une section **« Pour aller plus loin »** pour creuser quand tu as fini tes jobs.

---

## 🗺️ Parcours conseillé

| # | Démo | Ce que tu apprends |
|---|---|---|
| 01 | Le problème (anti-pattern)          | Pourquoi mettre des secrets en clair est dangereux |
| 02 | Les 3 méthodes côte à côte          | `environment`, `env_file`, interpolation `${VAR}` |
| 03 | Précédence des variables            | Qui gagne quand plusieurs sources définissent la même variable |
| 04 | `.env` et `.env.example`            | La convention pour ne pas commiter ses secrets |
| 05 | Créer des fichiers de secrets       | Un secret = un fichier, sans piège |
| 06 | `docker-compose.yml` avec secrets   | Consommer des secrets proprement (montage `/run/secrets/`) |
| 07 | User root vs non-root (CLI)         | La différence concrète en termes de dégâts possibles |
| 08 | Dockerfile sécurisé                 | Créer et utiliser un user non-root dans une image |
| 09 | `read_only`, `tmpfs`, capabilities  | Durcir le runtime |
| 10 | Scan avec Docker Scout              | Trouver les CVE d'une image |
| 11 | Scan avec Trivy                     | Idem, version open-source / CI/CD |

Fais-les dans l'ordre : chaque démo prépare la suivante.

---

## ✅ Prérequis

```bash
docker info | head -5        # Docker fonctionne
docker pull node:20-alpine   # Image utilisée dans la plupart des démos
docker pull alpine
```

Pour Scout (démo 10) : `docker login` à Docker Hub.
Pour Trivy (démo 11) : `docker pull aquasec/trivy`.

---

## 🧹 Entre deux démos

Si tu obtiens des erreurs « conteneur déjà existant » ou « volume déjà utilisé » :

```bash
docker compose down --volumes --remove-orphans
```

À la fin de toutes les démos :

```bash
docker system prune -af --volumes   # ⚠️ supprime TOUT ce qui n'est pas utilisé
```

---

## 📦 Stack technique

Aucune dépendance npm ou composer : les démos sont **stack-minimales** pour rester centrées sur la sécurité Docker. Tout ce dont tu as besoin est dans chaque sous-dossier.

---

## 🔗 Lien avec les jobs

Ces démos sont les fondations. Les **5 jobs** du jour reprennent ces concepts dans des projets plus complets :

- **Job 01** = démos 02 + 03 + 04 dans une API + MySQL
- **Job 02** = démos 05 + 06 en PHP avec convention `_FILE`
- **Job 03** = démos 07 + 08 + 09 dans une API complète
- **Jobs 04 et 05** (bonus) = démos 10 / 11 appliquées à ta propre image
