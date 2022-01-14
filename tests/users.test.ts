import request from "supertest";
import app from "@index";
import { expect } from "chai";

describe("Users", async () => {

  it("GET /users/ returns an array", async (done) => {

    await request(app)
      .get("/users/")
      .then((res) => {
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.be.an('array');

        done();

      });

  });

});