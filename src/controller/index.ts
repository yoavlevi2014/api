import { RequestHandler } from "express";

export const helloWorld: RequestHandler = async (req, res) => {
  return res.json({ error: "Hello world!" });
};
