import UserModel, { User } from "@models/user";

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;

export class UsersService {
  // Get uses based on ID.
  public async get(id: number): Promise<User> {
    
    // Need to validate the user given id to prevent spooky stuff

    // Need to do some TypeScript stuff to make this proper
    return await UserModel.findOne({"id": id}).then((data) => {
        
      // Need to do some validation first

      return data as User;

    })
    .catch((error: Error) => {
      throw error;
    });

  }

  // TODO - Add route for getting used based on name

  public create(userCreationParams: UserCreationParams): User {
    return {
      id: Math.floor(Math.random() * 10000), // Random
      ...userCreationParams
    };
  }
}
