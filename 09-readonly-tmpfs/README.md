# Démo 9 — `read_only` + `tmpfs` + capabilities

## 🎯 Objectif

Empiler plusieurs couches de durcissement runtime : filesystem en lecture seule, écriture autorisée seulement dans des zones précises, capabilities Linux retirées.

## 🚀 Lancer

```bash
docker compose up --build
```

## 👀 Sortie attendue

```
api-1  | User: appuser (uid=100)
api-1  | --- Tests d écriture ---
api-1  | /app/forbidden.txt        : ✅  bloqué (EROFS)
api-1  | /tmp/allowed.txt          : ✅  écriture autorisée (tmpfs)
api-1  | /etc/evil.conf            : ✅  bloqué (EROFS)
```

`EROFS` = *Read-Only File System*. C'est exactement ce qu'on veut.

## Comparaison sans protections

Édite temporairement le compose et commente `read_only: true`, relance avec `docker compose up --build`. Les 3 écritures réussissent → mesure ce qu'on a gagné.

## 🧠 Les 4 couches empilées

1. **`read_only: true`** — filesystem en lecture seule
2. **`tmpfs:`** — zones d'écriture **en mémoire** (perdues à l'arrêt → pas de persistance d'une attaque)
3. **`no-new-privileges:true`** — bloque `setuid`/`setgid` (empêche escalade vers root)
4. **`cap_drop: ALL`** — retire **toutes** les capabilities Linux fines

## ⚠️ Pièges

- Beaucoup d'applis veulent écrire dans `/var/log`, `/var/cache`, `/run` → ajoute-les en `tmpfs` si non-persistant, sinon utilise un volume nommé.
- MySQL ne supporte **PAS** `read_only: true` directement (il écrit dans `/var/lib/mysql`) → il faut un volume pour `/var/lib/mysql`.

## 🚀 Pour aller plus loin

1. **Désactiver une protection à la fois** et observer ce qui change :
   - Retire `read_only: true` → les écritures passent partout
   - Retire `cap_drop: ALL` → quelles capabilities ont été retirées ? Lance `docker run --rm --cap-drop=ALL alpine sh -c 'apk add curl 2>&1' | tail` pour voir le type d'erreur
2. **Réautoriser une capability précise** : après `cap_drop: ALL`, ajoute `cap_add: [NET_BIND_SERVICE]`. Quelle action ça permet ? (binder un port < 1024)
3. **App qui écrit dans `/var/log`** : ajoute `- /var/log` aux `tmpfs:`. Maintenant l'appli peut logger, mais les logs disparaissent au redémarrage — comment garder à la fois les logs et le durcissement ?
4. **Test des limites de ressources** : la section `deploy.resources.limits` est en commentaire dans le compose. Active-la. Lance un test mémoire (par ex. `dd if=/dev/zero of=/tmp/big bs=1M count=200`). Que se passe-t-il quand la limite est atteinte ?
