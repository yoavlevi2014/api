import { RequestHandler } from "express";
import UserModel from "@models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login endpoint
 *     description: Get user information, access token, and a refresh token.
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                    type: object
 *                    properties:
 *                     at:
 *                       type: string
 *                       description: Access token.
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                     rt:
 *                       type: string
 *                       description: Refresh token.
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *
 */

export const login: RequestHandler = async (req, res) => {
  await UserModel.findOne({ email: req.body.email })
    .then(async (user) => {
      if (user) {
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          const at = jwt.sign({ sub: user.id }, process.env.SEED as string, {
            expiresIn: "120m",
          });
          const rt = jwt.sign({ sub: user.id }, process.env.SEED as string, {
            expiresIn: "7d",
          });

          // old redis code, adding refresh token to array
          //   arrappend("tokens", ".", [JSON.stringify(rt)]).catch(async (err) => {
          //     throw err;
          //   });

          return res.json({
            id: user.id,
            email: user.email,
            username: user.username,
            accessToken: at,
            refreshToken: rt,
          });
        }
      }
    })
    .catch((error: Error) => {
      throw error;
    });

  return res.json({ error: "Oops, you typed something incorrectly!" });
};
