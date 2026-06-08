# Démo 11 — Scan avec Trivy

## 🎯 Objectif

Même chose que Scout, mais **open-source, gratuit, sans compte**, et conçu pour la CI/CD.

## Étape 1 — Premier scan (via Docker, pas d'install)

```bash
docker run --rm aquasec/trivy image node:18-alpine
```

→ La première fois, Trivy télécharge sa base de vulnérabilités (~30s). Ensuite c'est très rapide.

## Étape 2 — Filtrer par sévérité

```bash
docker run --rm aquasec/trivy image --severity CRITICAL,HIGH node:18
```

## Étape 3 — Comparer node:18 vs node:18-alpine

```bash
docker run --rm aquasec/trivy image --severity CRITICAL node:18 | tail -5
docker run --rm aquasec/trivy image --severity CRITICAL node:18-alpine | tail -5
```

## Étape 4 — Mode CI/CD : casser le pipeline volontairement

```bash
# Marche : pas de Critical sur alpine
docker run --rm aquasec/trivy image --exit-code 1 --severity CRITICAL node:18-alpine
echo "exit code: $?"
# 0

# Échoue volontairement
docker run --rm aquasec/trivy image --exit-code 1 --severity CRITICAL node:18
echo "exit code: $?"
# 1   -> le pipeline CI s'arrête
```

## 🧠 À retenir

> **Tu peux brancher cette commande dans une GitHub Action ou un GitLab CI : ton build CASSE automatiquement si tu introduis une CVE critique. C'est le "shift-left" : faire échouer tôt, dans le pipeline, pas en prod.**

## 🚀 Pour aller plus loin

1. **Scanner un Dockerfile** (pas une image construite) :

   ```bash
   docker run --rm -v "$(pwd):/work" aquasec/trivy config /work
   ```

   Que détecte-t-il que le scan d'image ne détecte pas ? (indice : mauvaises pratiques Dockerfile)
2. **Sortie JSON** pour intégration CI :

   ```bash
   docker run --rm aquasec/trivy image --format json --severity HIGH,CRITICAL node:18-alpine > scan.json
   ```

   Ouvre `scan.json`. Comment l'utiliser dans un script de post-traitement ?
3. **Ignorer des CVE acceptées** : crée un `.trivyignore` avec une CVE-ID (ex: `CVE-2023-12345`). Relance le scan — la CVE n'apparaît plus. Quand est-ce légitime ?
4. **Scanner ton propre projet** : prends l'image de la démo 8 (`demo-secure`) et scanne-la. Combien de CVE ? D'où viennent-elles ?
5. **Mini-pipeline** : écris un script bash qui :
   - Build une image
   - La scanne avec Trivy `--exit-code 1`
   - Push vers un registre **seulement** si le scan passe.
