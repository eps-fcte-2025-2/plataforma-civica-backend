FROM node:22-alpine

WORKDIR /app

RUN npm i -g pnpm -y

COPY package.json .

RUN pnpm i

COPY . .

CMD [ "pnpm", "dev" ]
