import { model } from "mongoose";
import UserSchema from "@schemas/users";

export interface User {
  id: string;
  admin?: boolean;
  username: string;
  email: string;
  name: string;
  surname: string;
  password?: string;
  following?: [string];
  friends?: [string];
  bio?: string;
  profileID: string;
}

const UserModel = model<User>("users", UserSchema);

export default UserModel;
