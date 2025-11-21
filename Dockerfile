FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/ng-pokedex/browser /usr/share/nginx/html/ng-pokedex

COPY --from=build /app/ssl /usr/share/nginx/ssl

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD [ "nginx", "-g", "daemon off;" ]