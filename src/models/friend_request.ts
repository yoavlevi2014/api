import { model } from "mongoose";
import FriendRequestSchema from "@schemas/friend_request";

export interface FriendRequest {
  request_id: string;
  to_user: string;
  from_user: string;
  status: string;
}

const FriendRequestModel = model<FriendRequest>("friend_requests", FriendRequestSchema);

export default FriendRequestModel;
