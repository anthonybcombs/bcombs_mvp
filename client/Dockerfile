FROM node
WORKDIR /mnt/c/www/bcombs/client

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 1234

CMD [ "npm", "start" ]