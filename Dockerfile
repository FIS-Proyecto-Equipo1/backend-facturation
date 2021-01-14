FROM node:9-alpine


WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY *.js ./
 
EXPOSE 5002

CMD npm start
