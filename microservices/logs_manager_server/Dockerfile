FROM node:latest

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY ./src ./src

EXPOSE 9091

CMD ["npm", "run", "dev"]a