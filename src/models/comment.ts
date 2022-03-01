import { User } from "@models/user";

export interface Comment {
  id: string;
  author: User;
  content: string;
  likes: number;
  created: number;
  post_id: number // (Might use a post model instead of an id here idk)
  // replies: [Comment];
}
