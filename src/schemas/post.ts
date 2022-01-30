import { Schema } from "mongoose";
import { Post } from "@models/post";

/**
 * @openapi
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Posts' UUID(v4).
 *           example: 94d50698-66c6-4d4d-8fa0-64eeec655631
 *         user_id:
 *           type: string
 *           description: The user id of the user that created the post
 *           example: 2dd466b7-cf35-4c80-96c7-28c526c0c28d
 *         title:
 *           type: string
 *           description: The title of the post
 *           example: Post title
 *         content:
 *           type: string
 *           description: A string of SVG data containing the contents of the artwork
 *           example: <?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>
 *         likes:
 *           type: number
 *           description: The number of likes the post has accumulated
 *           example: 10
 *         created:
 *           type: string
 *           description: POSIX creation time.
 *           example: 1642082603
 *         users:
 *           type: array
 *           description: An array of users that have collaberated on the post
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: A user's ID.
 *                 example: 2dd466b7-cf35-4c80-96c7-28c526c0c28d
 *             required:
 *               - id
 *       required:
 *         - id
 *         - user_id
 *         - title
 *         - content
 *         - likes
 *         - created
 */
const PostSchema = new Schema<Post>(
  {
    id: { type: String, required: true, unique: true, index: true },
    author: { type: Object, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, required: true },
    created: { type: Number, required: true, index: true },
    users: [{ type: Object, required: false }],
  },
  { timestamps: true }
);

export default PostSchema;
