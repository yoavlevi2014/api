import { model } from "mongoose";
import PostSchema from "@schemas/post";

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  likes: number;
  created: number;
  users: [string];
}

const PostModel = model<Post>("posts", PostSchema);

export default PostModel;
