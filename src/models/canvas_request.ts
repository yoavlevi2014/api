import CanvasRequestSchema from "@schemas/canvas_request";
import { model } from "mongoose";

export interface CanvasRequest {
    request_id: string;
    to_user: string;
    from_user: string;
    status: string;
    size: string;
    roomID: string;
  }

  const CanvasRequestModel = model<CanvasRequest>("canvas_requests", CanvasRequestSchema);

export default CanvasRequestModel;