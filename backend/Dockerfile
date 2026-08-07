FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Package.json du projet Prisma (racine)
COPY package*.json ./

# Package.json du backend NestJS
COPY backend/package*.json ./backend/

# Installer les dépendances Prisma
RUN npm install

# Copier Prisma
COPY prisma ./prisma

# Copier le backend NestJS
COPY backend/. ./backend/

# Générer Prisma Client
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Le backend NestJS se trouve ici
WORKDIR /app/backend

EXPOSE 3000

CMD ["npm", "run", "start:dev"]