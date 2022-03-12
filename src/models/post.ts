import { model } from "mongoose";
import PostSchema from "@schemas/post";
import { User } from "@models/user";

export interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  likes: number;
  created: number;
  users: [User];
  size: string;
  // TODO comments
  // comments: [Comment] 
}

const PostModel = model<Post>("posts", PostSchema);

export default PostModel;
