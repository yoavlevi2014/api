import { model } from "mongoose";
import UserSchema from "@schemas/users";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  password: string;
  following?: [string];
}

const UserModel = model<User>("users", UserSchema);

export default UserModel;
