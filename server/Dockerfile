FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG FRONTEND_URL
ENV FRONTEND_URL=$FRONTEND_URL

EXPOSE 5000


CMD ["node", "server.js"]