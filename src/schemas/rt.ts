import { Schema } from "mongoose";
import { RT } from "@models/rt";


const RTSchema = new Schema<RT>(
  {
    token: {type: String, required: true }
  }
);

export default RTSchema;
