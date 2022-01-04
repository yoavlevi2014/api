import { model } from "mongoose";
import UserSchema from "@schemas/users";

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumbers: string[];
}

const UserModel =  model<User>('users', UserSchema);

export default UserModel;