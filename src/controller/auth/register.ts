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
 */


 export const register: RequestHandler = async (req, res) => {

    const user: User = {
        id: uuidv4(),
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: req.body.password
    }

    if (!isEmail(user.email))
        return res.status(400).json({error: "Email is invalid"});

    const at = jwt.sign({ sub: user.id }, process.env.SEED as string, {
        expiresIn: "120m",
      });
    const rt = jwt.sign({ sub: user.id }, process.env.SEED as string, {
        expiresIn: "7d",
    });

    await UserModel.findOne({username: user.username}).then(async (u) => {

        if (u) {

            return res.status(200).json({error: "Username is already taken"});

        } else {

            await UserModel.findOne({username: user.email}).then(async (u) => {

                if (u) {
        
                    return res.status(200).json({error: "Email is already taken"});
        
                } else {
        
                    user.password = bcrypt.hashSync(user.password, 10);

                    await new UserModel({...user}).save().then(async() => {

                        await new RTModel({token: rt}).save().then(async() => {

                            return res.status(201).json({user: user, tokens: {at: at, rt: rt}});
                        
                        }).catch((e: Error) => {
                
                            console.log(e);
    
                        });;

                    }).catch((e: Error) => {
                
                        return res.status(500).json({error: {name: e.name, message: e.message}});

                    });

                }

            });

        }

    });

    res.status(501).json({error: "error"});

};