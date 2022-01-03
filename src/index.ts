import express, { Application } from "express";
import morgan from "morgan";
import nocache from "nocache";

import { RegisterRoutes } from "@tsoa/routes";

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "@tsoa/swagger.json";

const app: Application = express();
const port = process.env.PORT || 3000;

app.set("etag", false);
app.use(nocache());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded());

RegisterRoutes(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}`);
});

export default app;
