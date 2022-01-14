import mongoose from "mongoose";

export default async () => {
  const db: { [key: string]: string } = {
    username: process.env.DB_ADMIN_USERNAME as string,
    password: process.env.DB_ADMIN_PASSWORD as string,
    uri: process.env.DB_URI as string,
    port: process.env.DB_PORT as string,
  };

  const uri = `mongodb://${db.username}:${db.password}@${db.uri}:${db.port}/drawdojo?authSource=admin`;
  return mongoose.connect(uri).then(
    () => {
      console.log("Connected to mongo.");
    },
    (err) => {
      throw err;
    }
  );
};
