import { User } from "@models/user";
import { Post } from "@models/post";

export interface Profile {
    user: User;
    posts?: [Post]
    comments?: [Post];
  }