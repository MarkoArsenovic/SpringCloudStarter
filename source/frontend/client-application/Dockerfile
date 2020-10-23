FROM node:12.4.0-alpine AS builder

COPY . ./client-application
WORKDIR /client-application

RUN apk add --no-cache git

RUN npm i -ddd
RUN $(npm bin)/ng build --prod

FROM nginx:1.15.8-alpine

COPY --from=builder /client-application/dist/client-application/ /usr/share/nginx/html
