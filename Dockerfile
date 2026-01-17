FROM node:24 AS build
WORKDIR /build

COPY package.json package-lock.json ./

RUN npm ci

COPY src/ src/
COPY tsconfig.json vite.config.ts index.html ./

RUN npm run build

FROM nginx:1.28.0-alpine-slim

COPY nginx/nginx.conf /etc/nginx/
COPY nginx/default.conf /etc/nginx/conf.d/
COPY --from=build /build/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
