import { model } from "mongoose";
import RTSchema from "@schemas/rt";

export interface RT {
  token: string
}

const RTModel = model<RT>("refresh", RTSchema);

export default RTModel;
