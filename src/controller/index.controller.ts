import { Controller, Get, Route } from "tsoa";
@Route("")
export class indexController extends Controller {
  @Get("")
  public async get() {
    return { msg: "Hello world!" };
  }
  @Get("daddy")
  public async getDaddy() {
    return { msg: "daddy!" };
  }
}
