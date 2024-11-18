FROM node:20-alpine

ARG NODE_ENV_ARG=development

ENV NODE_ENV=development

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

RUN npx tsc
