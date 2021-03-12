FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1234

CMD ["npx", "babel-node", "main.js"]