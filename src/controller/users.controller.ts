import { Controller, Get, Path, Query, Route } from "tsoa";
import { User } from "@models/user";
import { UsersService } from "@services/users";

@Route("users")
export class UsersController extends Controller {
  @Get("{userId}")
  public async getUser(
    @Path() userId: number,
    @Query() name?: string
  ): Promise<User> {
    return new UsersService().get(userId, name);
  }
}
