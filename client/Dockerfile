# builder
FROM node:12.18.2-slim as builder

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json ./package.json
RUN npm install
RUN npm install react-scripts -g

COPY . .
RUN npm run build


# executable image
FROM nginx

RUN rm -rf /etc/nginx/conf.d
COPY config /etc/nginx

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]