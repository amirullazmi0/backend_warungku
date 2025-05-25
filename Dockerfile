# Gunakan image Node resmi (alpine = ringan)
FROM node:20-alpine

# Install dependencies dasar (openssl untuk Prisma)
RUN apk add --no-cache bash openssl

# Direktori kerja di dalam container
WORKDIR /app

# Salin file dependency dulu untuk cache layer install
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Salin seluruh source code dan file .env (pastikan ada di root project)
COPY . .
COPY .env .env

# Generate Prisma Client (pastikan .env sudah ada supaya Prisma bisa baca DATABASE_URL)
RUN npx prisma generate

# Build NestJS
RUN yarn build

# Buka port aplikasi
EXPOSE 4001

# Jalankan aplikasi
CMD ["node", "dist/src/main"]