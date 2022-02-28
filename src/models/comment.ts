import { User } from "@models/user";

export interface Comment {
  id: string;
  author: User;
  content: string;
  likes: number;
  created: number;
  users: [User];
  // replies: [Comment];
}
