import { Controller, Get, Path, Route } from "tsoa";
import { User } from "@models/user";
import { UsersService } from "@services/users";

@Route("users")
export class UsersController extends Controller {
  @Get("{userId}")
  public async getUser(
    @Path() userId: number,
  ): Promise<User> {
    return new UsersService().get(userId);
  }
}
