import { RequestHandler } from "express";

const index: RequestHandler = async (_req, res) => {
  return res.json({ msg: "Hello world!" });
};

export default index;
