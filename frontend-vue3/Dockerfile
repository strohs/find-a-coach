# This Dockerfile builds the frontend application, then copies the static assets to nginx and finally starts
# the nginx server

# syntax=docker/dockerfile:1
FROM node:14.20 AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx

COPY --from=builder /app/dist /usr/share/nginx/html

#EXPOSE 80
#
#STOPSIGNAL SIGQUIT
#
#CMD ["nginx", "-g", "daemon off;"]