import express, { Application } from "express";
import morgan from "morgan";
import nocache from "nocache";

import { RegisterRoutes } from "@tsoa/routes";

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "@tsoa/swagger.json";

import mongoose from 'mongoose';

const app: Application = express();
const port = process.env.PORT || 3000;

const dbUsername =  process.env.DB_ADMIN_USERNAME;
const dbPassword = process.env.DB_ADMIN_PASSWORD;
const dbURI = process.env.DB_URI;
const dbPort = process.env.DB_PORT;

const uri = `mongodb://${dbUsername}:${dbPassword}@${dbURI}:${dbPort}/drawdojo?authSource=admin`;

mongoose.connect(uri);

// eslint-disable-next-line no-console
mongoose.connection.on('open', () => {console.log('Connected to mongo server.');});

// TODO - Swap console.error for some proper logging
// eslint-disable-next-line no-console
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

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