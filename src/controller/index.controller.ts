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
  @Get("Test")
  public async getTest() {
    return { msg: "it's working!!" };
  }
}
