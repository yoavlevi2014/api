import { model } from "mongoose";
import PostSchema from "@schemas/post";
import { User } from "@models/user";
import { Comment } from "@models/comment";

export interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  likes: number;
  created: number;
  users: [User];
  size: string;
  comments?: [Comment];
}

const PostModel = model<Post>("posts", PostSchema);

export default PostModel;
