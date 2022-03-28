import { CanvasRequest } from "@models/canvas_request";
import { Schema } from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     CanvasRequest:
 *       type: object
 *       properties:
 *         request_id:
 *           type: string
 *           description: Friend request id
 *           example: 2e48260e-9c8a-4857-bdf3-a8ac45ae5361
 *         to_user:
 *           type: string
 *           description: Username of the user you are sending the canvas request to
 *           example: UserOne
 *         from_user:
 *           type: string
 *           description: Username of the user you are sending the canvas request from
 *           example: UserTwo
 *         status:
 *           type: string
 *           description: Status of the canvas request
 *           example: pending (note need to add the enum of options here for the docs)
 *         size:
 *           type: string
 *           description: Size of the canvas
 *           example: Portrait, Square or Rectangle
 *         roomID:
 *           type: string
 *           description: ID that corresponds with a socket io room
 *           example: sdDeEF
 *       required:
 *         - request_id
 *         - to_user
 *         - from_user
 *         - status
 *         - size
 *         - roomID
 */
const CanvasRequestSchema = new Schema<CanvasRequest>(
    {
        request_id: { type: String, required: true },
        to_user: { type: String, required: true },
        from_user: { type: String, required: true },
        status: { type: String, required: true },
        size: { type: String, required: true },
        roomID: { type: String, required: true }
    }
);

export default CanvasRequestSchema;