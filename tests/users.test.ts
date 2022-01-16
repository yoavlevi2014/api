import request from "supertest";
import app from "@index";
import { expect } from "chai";
// import  UserModel from '@models/user';


let authToken: string;

before(async () => {

  if (process.env.authToken  !== undefined) {

    authToken = process.env.authToken;

  } else {

    throw new Error("Auth token isn't set, exiting")

  }

});

describe("Users", async () => {

  it("GET /users/ returns an array", async () => {

    return await request(app)
      .get("/users/").set('Authorization', `Bearer ${authToken}`)
      .then((res) => {

        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.eql(1);

      }).catch((error: Error) => {

        console.error(error);

      });

  });

});