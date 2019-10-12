FROM node:12.2.0-alpine as build

WORKDIR /usr/app
ENV PATH /usr/app/node_modules/.bin:$PATH
COPY package.json /usr/app/package.json

RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
RUN npm install -g serve

COPY . /usr/app

RUN npm run build
CMD [ "serve", "-s", "build" ]