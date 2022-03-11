import { Schema } from "mongoose";
import { FriendRequest } from "@models/friend_request";


/**
 * @openapi
 * components:
 *   schemas:
 *     FriendRequest:
 *       type: object
 *       properties:
 *         request_id:
 *           type: string
 *           description: Friend request id
 *           example: 2e48260e-9c8a-4857-bdf3-a8ac45ae5361
 *         to_user:
 *           type: string
 *           description: Username of the user you are sending the friend request to
 *           example: UserOne
 *         from_user:
 *           type: string
 *           description: Username of the user you are sending the friend request from
 *           example: UserTwo
 *         status:
 *           type: string
 *           description: Status of the friend request
 *           example: pending (note need to add the enum of options here for the docs)
 *       required:
 *         - request_id
 *         - to_user
 *         - from_user
 *         - status
 */
const FriendRequestSchema = new Schema<FriendRequest>(
  {
    request_id: {type: String, required: true },
    to_user: {type: String, required: true },
    from_user: {type: String, required: true },
    status: {type: String, required: true }
  }
);

export default FriendRequestSchema;
