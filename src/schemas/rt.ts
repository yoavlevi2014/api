import { Schema } from "mongoose";
import { RT } from "@models/rt";


/**
 * @openapi
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Access token.
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NTBjYTg2MC05ODIzLTQxMDgtOGEyYi1hNjk2M2Y1OWU1MTAiLCJpYXQiOjE2NDI5NDc2MjcsImV4cCI6MTY0Mjk1NDgyN30.46bhWLjmrq1ZLTFyJgdg7MvP_C1rPYN3fMdzjr12XNY
 *       required:
 *         - token
 */
const RTSchema = new Schema<RT>(
  {
    token: {type: String, required: true }
  }
);

export default RTSchema;
