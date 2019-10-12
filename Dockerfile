FROM node:9.4.0-alpine as frontend

WORKDIR /usr/app/frontend/
COPY frontend/package*.json ./
RUN npm install -qy
COPY frontend/ ./
RUN npm run build


# Setup the server

FROM node:9.4.0-alpine

WORKDIR /usr/app/
COPY --from=frontend /usr/app/frontend/build/ ./frontend/build/

WORKDIR /usr/app/server/
COPY server/package*.json ./
RUN npm install -qy
COPY server/ ./

ENV PORT 8000

EXPOSE 8000

CMD ["npm", "start"]