FROM node:17.3.0-bullseye
WORKDIR /workspace
RUN npm install --quiet
CMD npm start