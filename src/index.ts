/* eslint-disable no-console */

import express, { Application } from "express";
import eJwt from "express-jwt";
import nocache from "nocache";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
import doc from "@doc";

import index from "@controller";

import { login, register } from "@auth";

import UserController from "@controller/users";
import PostController from "@controller/post";

import db from "@db";
import { createSocketServer } from "socket";

const app: Application = express();

const main = async () => {
  const port = process.env.PORT;

  db();

  app.set("etag", false);
  app.use(nocache());
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use(express.urlencoded({ extended: true }));
  app.use(function (_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc(doc)));

  app.use(
    eJwt({
      secret: process.env.SEED as string,
      algorithms: ["HS256"],
    }).unless({
      path: ["/auth/login", "/auth/register", "/auth/refresh", "/docs", "/"],
    })
  );

  // Index
  app.get("/", index);

  // Auth routes
  app.post("/auth/login", login);
  app.post("/auth/register", register);

  // User routes
  app.get("/users", UserController.getAllUsers);
  app.get("/users/id/:id", UserController.getUserByID);
  app.get("/users/name/:username", UserController.getUserByUsername);
  app.get("/users/search/:query", UserController.search);
  app.get("/users/friends/requests", UserController.getAllFriendRequests);
  app.get("/users/friends/:user/requests", UserController.getAllUsersFriendRequests);
  app.get("/users/friends/:user/requests/to", UserController.getAllUsersToFriendRequests);
  app.get("/users/friends/:user/requests/from", UserController.getAllUsersFromFriendRequests);
  app.post("/users/friends/request", UserController.sendFriendRequest);
  app.post("/users/friends/request/accept/:request_id", UserController.acceptFriendRequest);
  app.post("/users/friends/request/cancel/:request_id", UserController.cancelFriendRequest);
  app.post("/users/bio", UserController.editBio);

  // Post routes
  app.get("/posts", PostController.getAllPosts);
  app.get("/posts/user", PostController.getPostsByUser);
  app.post("/posts", PostController.createPost);
  app.post("/posts/comment", PostController.addComment);
  app.post("/posts/like", PostController.addLike);

  const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });

  // Launch socket server
  createSocketServer(server);
  
};

main();

export default app;
