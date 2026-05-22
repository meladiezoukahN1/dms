FROM node:22-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

# Build-time ENV vars — dummy values needed only so that prisma generate
# and Next.js build succeed without a running database.
# All values are overridden at runtime via env_file (.env.docker).
ENV DATABASE_URL="mysql://archive_user:archive_password@mysql:3306/archive_db" \
    AUTH_SECRET="docker_build_secret" \
    NEXTAUTH_SECRET="docker_build_secret" \
    NEXTAUTH_URL="http://localhost:3000" \
    NEXT_PUBLIC_API_URL="http://localhost:3000" \
    NODE_ENV="production"

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

# db push syncs the schema to the DB without requiring migration files
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm run start"]