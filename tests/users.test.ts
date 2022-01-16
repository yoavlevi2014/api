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

  it("GET /users/ returns an array of correct size", async () => {

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

  it("GET /users/name/:name returns the correct user", async () => {

    return await request(app)
      .get("/users/name/admin").set('Authorization', `Bearer ${authToken}`)
      .then((res) => {

        expect(res.status).to.eql(200);
        expect(res.body.email).to.eql("admin@test.co.uk");
        expect(res.body.name).to.eql("Admin");
        expect(res.body.surname).to.eql("User");
        expect(res.body.username).to.eql("admin");

      }).catch((error: Error) => {

        console.error(error);

      });

  });

});