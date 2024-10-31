FROM node:20.18.0

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=.npm npm install

COPY expressServer.js expressServer.js

EXPOSE 5001