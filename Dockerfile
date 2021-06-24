FROM node:14-alpine
RUN mkdir -p /var/log/bin-collections-notifier
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN npx tsc
EXPOSE 3000
CMD ["npm", "start"]