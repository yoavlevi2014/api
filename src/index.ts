import express, { Application } from "express";
import eJwt from "express-jwt";
import nocache from "nocache";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
import doc from "@doc";

import index from "@controller";
import { login } from "@auth";

import db from "@db";

const app: Application = express();

const main = async () => {
  const port = process.env.PORT;

  db();

  app.set("etag", false);
  app.use(nocache());
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use(express.urlencoded());

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc(doc)));

  app.use(
    eJwt({
      secret: process.env.SEED as string,
      algorithms: ["HS256"],
    }).unless({
      path: ["/auth/login", "/auth/register", "/auth/refresh", "/docs", "/"],
    })
  );

  app.get("/", index);
  app.post("/auth/login", login);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`listening on port ${port}`);
  });
};
main();

export default app;
