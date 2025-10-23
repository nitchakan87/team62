FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN apk add --no-cache bash && \
    mkdir -p src/assets && \
    chmod +x env-to-js.sh && \
    ./env-to-js.sh && \
    npm install && \
    npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/loan-app /usr/share/nginx/html
