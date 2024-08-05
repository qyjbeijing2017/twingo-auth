FROM node:21-alpine AS node-builder

WORKDIR /code

RUN apk add git

ADD package*.json .
RUN yarn

ADD . .
RUN yarn build

FROM node:21-alpine

WORKDIR /code
ENV NODE_ENV=production

COPY --from=node-builder /code/package*.json ./
COPY --from=node-builder /code/node_modules ./node_modules
COPY --from=node-builder /code/dist ./dist
COPY --from=node-builder /code/.env* ./
ADD ./tmplates ./tmplates

CMD ["node", "dist/main.js"]
