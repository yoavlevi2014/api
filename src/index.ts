import express from "express";
import nocache from "nocache";
import { helloWorld } from "@controller";

const main = async () => {
  const app = express();
  const port = process.env.PORT;

  app.set("etag", false);
  app.use(nocache());
  app.use(express.json());
  app.use(express.urlencoded());

  app.get("/", helloWorld);
  //   app.get("/posts", posts);
  //   app.post("/auth/login", login);
  //   app.post("/auth/register", register);
  //   app.post("/auth/refresh", refresh);
  //   app.post("/admin/post", post);

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

main();
