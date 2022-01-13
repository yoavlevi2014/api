import { RequestHandler } from "express";

/**
 * @openapi
 * /:
 *   get:
 *     description: Returns a string
 *     responses:
 *       200:
 *         description: Returns Hello world!.
 */
const index: RequestHandler = async (_req, res) => {
  return res.json({ msg: "Hello world!" });
};

export default index;
