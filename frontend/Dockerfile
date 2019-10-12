FROM node:lts-slim

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci -qy

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]