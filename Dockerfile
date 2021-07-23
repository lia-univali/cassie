# build environment
FROM node:13-alpine as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn add @material-ui/icons --ignore-engines --network-timeout 1000000000
RUN yarn install
COPY . ./
RUN yarn build
FROM nginx:1.12-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]