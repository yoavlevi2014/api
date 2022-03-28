import { RequestHandler } from "express";
import UserModel from "@models/user";
import jwt from "jsonwebtoken";

export const verifyToken: RequestHandler = async (req, res) => {
  const at = req.headers.authorization?.split(" ")[1];

  if (at) {
    await jwt.verify(at, process.env.SEED as string, async (err, token) => {
      if (err || !token) {
        return res.status(403).json({ error: "Error verifying token" });
      }

      await UserModel.findOne({ id: token.sub }).then(async (user) => {
        if (!user || !user.admin) {
          return res.status(403).json({ error: "Invalid user" });
        } else {
          delete user["password"];
          return res.json(user);
        }
      });
    });
  }
};
