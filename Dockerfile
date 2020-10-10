FROM node:lts-alpine AS build
WORKDIR /sln
COPY package.json ./
RUN npm install && npm cache clean --force
COPY . ./
RUN npm run build -- --prod

FROM pierrezemb/gostatic
COPY --from=build /sln/dist/market /srv/http
CMD ["-fallback=/index.html"]
