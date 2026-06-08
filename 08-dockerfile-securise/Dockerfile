# Dockerfile sécurisé : user non-root
FROM node:20-alpine
WORKDIR /app

# 1. Créer un groupe et un utilisateur DÉDIÉS
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 2. Copier le code AVEC le bon propriétaire (sinon root possède les fichiers)
COPY --chown=appuser:appgroup package*.json ./
COPY --chown=appuser:appgroup server.js ./

# 3. (Pas de RUN npm install ici : pas de dépendances dans cette démo)
#    En vrai : RUN npm ci --only=production AVANT le USER

# 4. Basculer sur l'utilisateur non-root pour TOUT ce qui suit
USER appuser

# 5. Lancement
CMD ["node", "server.js"]
