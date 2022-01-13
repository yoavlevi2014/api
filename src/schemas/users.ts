import { Schema } from "mongoose";
import { User } from "@models/user";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User's UUID(v4).
 *           example: 94d50698-66c6-4d4d-8fa0-64eeec655631
 *         name:
 *           type: string
 *           description: User's first name.
 *           example: Leanne
 *         surname:
 *           type: string
 *           description: User's last name.
 *           example: Graham
 *         email:
 *           type: string
 *           description: User's email.
 *           example: test@gmail.com
 *         username:
 *           type: string
 *           description: User's username(ASCII only).
 *           example: Hello!!
 *         createdAt:
 *           type: string
 *           description: POSIX creaion time.
 *           example: 1642082603
 *         updatedAt:
 *           type: string
 *           description: POSIX update time.
 *           example: 1642082603
 *         following:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: followed user's ID.
 *                 example: 2dd466b7-cf35-4c80-96c7-28c526c0c28d
 *               username:
 *                 type: string
 *                 description: followed user's Username.
 *                 example: CoolPerson420
 *
 */

const UserSchema = new Schema<User>(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    following: [{ type: String, required: false }],
  },
  { timestamps: true }
);

export default UserSchema;
