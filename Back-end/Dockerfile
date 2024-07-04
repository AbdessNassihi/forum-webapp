FROM node:alpine3.11
RUN npm install -g nodemon
WORKDIR /usr/code
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]