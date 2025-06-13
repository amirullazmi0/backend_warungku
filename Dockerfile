FROM node:18-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY prisma ./prisma
COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 4444

CMD ["npm", "run", "start:prod"]