# build environment
FROM node:13-alpine as build
RUN npm install -g yarn
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN yarn install — silent
RUN yarn install react-scripts@3.0.1 -g — silent
COPY . /app
RUN yarn build
# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD [“nginx”, “-g”, “daemon off;”]