FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY package.json package-lock.json ./

# Copier le package du workspace backend
COPY backend/package.json ./backend/package.json

# Installer toutes les dépendances du workspace
RUN npm install

# Copier Prisma
COPY prisma ./prisma

# Générer Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3000

CMD ["npm", "run", "start:dev", "--workspace=backend"]