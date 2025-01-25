FROM node:22-alpine as BUILDER

COPY ./package*.json ./

RUN npm ci

COPY ./tsconfig.json ./

COPY ./src/ ./src

RUN npm run build

FROM node:22-alpine

COPY ./package*.json ./

RUN npm ci --omit=dev

COPY --from=BUILDER /dist ./dist

CMD ["npm", "run", "start"]