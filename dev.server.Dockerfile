FROM node:16

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

CMD [ "npm", "run", "dev" ]

EXPOSE 8000

