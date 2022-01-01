FROM node:17.3.0-bullseye
RUN mkdir /api
COPY ../api /api
COPY ../api /api
WORKDIR /api
RUN npm install --quiet
CMD npm start