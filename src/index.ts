import express, { Application } from "express";
import morgan from "morgan";
import nocache from "nocache";

import swaggerDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import index from "@controller";
import eJwt from "express-jwt";

import mongoose from "mongoose";

const app: Application = express();
const port = process.env.PORT;

const db: { [key: string]: string } = {
  username: process.env.DB_ADMIN_USERNAME as string,
  password: process.env.DB_ADMIN_PASSWORD as string,
  uri: process.env.DB_URI as string,
  port: process.env.DB_PORT as string,
};

const uri = `mongodb://${db.username}:${db.password}@${db.uri}:${db.port}/drawdojo?authSource=admin`;
console.log(db);
mongoose.connect(uri);

// eslint-disable-next-line no-console
mongoose.connection.on("open", () => {
  console.log("Connected to mongo server.");
});

// TODO - Swap console.error for some proper logging
// eslint-disable-next-line no-console
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

app.set("etag", false);
app.use(nocache());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerDoc({
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Drawdojo",
          version: "0.0.1",
        },
      },
      apis: ["./src/controller/**/*.ts", "./src/schemas/**/*.ts"],
      servers: [
        {
          url: "https://api.operce.net/",
          description: "Main server",
        },
      ],
    })
  )
);

app.use(
  eJwt({
    secret: process.env.SEED as string,
    algorithms: ["HS256"],
  }).unless({
    path: ["/auth/login", "/auth/register", "/auth/refresh", "/docs", "/"],
  })
);

app.get("/", index);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}`);
});

export default app;
