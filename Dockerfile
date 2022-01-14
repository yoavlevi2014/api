FROM node:17.3.0-bullseye
RUN mkdir /api
COPY . /api/
WORKDIR /api
RUN npm install --quiet
RUN apt update
RUN apt install -y iputils-ping
ENTRYPOINT ["npm"]