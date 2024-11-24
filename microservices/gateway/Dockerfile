FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src

EXPOSE 9095

CMD ["npm", "run", "dev"]