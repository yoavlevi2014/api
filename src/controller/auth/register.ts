import { RequestHandler } from "express";
import UserModel, { User } from "@models/user";
import RTModel from "@models/rt";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { isEmail } from "@helpers/regex";

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register endpoint
 *     description: Create user information, generate an access token and a refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's first name.
 *                 example: Leanne
 *               surname:
 *                 type: string
 *                 description: User's last name.
 *                 example: Graham
 *               email:
 *                 type: string
 *                 description: User's email.
 *                 example: test@gmail.com
 *               username:
 *                 type: string
 *                 description: User's username(ASCII only).
 *                 example: Hello
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: "IlOveT0b3tR1cky"
 *             required:
 *               - name
 *               - surname
 *               - email
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Register successful
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
 *                    required:
 *                      - at
 *                      - rt
 *               required:
 *                 - user
 *                 - tokens
 *       200:
 *         description: Username or email address have already been taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Email is already taken
 *       400:
 *         description: There is an error with one or more of the provided attributes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Username is missing
 *       500:
 *         description: An internal error occured while trying to create the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: MongooseError
 */

export const register: RequestHandler = async (req, res) => {
  const user: User = {
    id: uuidv4(),
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    surname: req.body.surname,
    password: req.body.password,
    profileID: ""
  };

  // There's probably a better way of doing this but you need to check all properties are defined
  if (!user.username)
    return res.status(400).json({ error: "Username is missing" });

  if (!user.email) return res.status(400).json({ error: "Email is missing" });

  if (!user.name) return res.status(400).json({ error: "Name is missing" });

  if (!user.surname)
    return res.status(400).json({ error: "Surname is missing" });

  if (!user.password)
    return res.status(400).json({ error: "Password is missing" });

  // Check supplied email is valid
  if (!isEmail(user.email))
    return res.status(400).json({ error: "Email is invalid" });

  // Create tokens
  const at = jwt.sign({ sub: user.id }, process.env.SEED as string, {
    expiresIn: "120m",
  });
  const rt = jwt.sign({ sub: user.id }, process.env.SEED as string, {
    expiresIn: "7d",
  });

  await UserModel.findOne({ username: user.username }).then(async (u) => {
    if (u) {
      return res.status(200).json({ error: "Username is already taken" });
    } else {
      await UserModel.findOne({ email: user.email }).then(async (u) => {
        if (u) {
          return res.status(200).json({ error: "Email is already taken" });
        } else {
          user.password = bcrypt.hashSync(user.password as string, 10);

          await UserModel.find({ profileID : { $regex: `${user.name.toLocaleLowerCase()}.${user.surname.toLocaleLowerCase()}`, $options: "i" } }).then(async (users) => {

            user.profileID = `${user.name.toLocaleLowerCase()}.${user.surname.toLocaleLowerCase()}.${users.length + 1}`;

          }).catch(() => {

            user.profileID = `${user.name.toLocaleLowerCase()}.${user.surname.toLocaleLowerCase()}.0`;

          })

          await new UserModel({ ...user })
            .save()
            .then(async () => {
              await new RTModel({ token: rt })
                .save()
                .then(async () => {
                  // Return the user object without hashed password
                  delete user["password"];

                  return res
                    .status(201)
                    .json({ user: user, tokens: { at: at, rt: rt } });
                })
                .catch((e: Error) => {
                  // eslint-disable-next-line no-console
                  console.log(e);
                });
            })
            .catch((e: Error) => {
              return res.status(500).json({ error: e.name });
            });
        }
      });
    }
  });
};
