FROM node:22-alpine
WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE 8080

CMD ["node", "dist/main.js"]