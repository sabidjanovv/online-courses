FROM --platform=linux/amd64 node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM --platform=linux/amd64 node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3033

CMD ["npm", "run", "start:prod"]
