FROM node:14

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .

EXPOSE 3000

RUN npm run tsc
CMD [ "node", "index.js" ]