# containerize the rest-api

# syntax=docker/dockerfile:1
FROM node:14.20

ENV MONGODB_URI="mongodb://root:password@localhost:27017/findACoachDB?authSource=admin"

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 8181

CMD ["npm", "start"]