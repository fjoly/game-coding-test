FROM node:17.3

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 3000

CMD [ "yarn", "start" ]