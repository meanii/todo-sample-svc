FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

EXPOSE 3001

CMD ["pnpm", "run", "start"]