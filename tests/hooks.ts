import db from "@db";
import request from "supertest";
import app from "index";
import mongoose from "mongoose";

export const mochaHooks = {

  beforeAll: [
    
    // Connect to the database before running tests
    async function () {
      console.log("Connecting to database");
      await db();
      // test stuff
      return await request(app).get("/users").then((response) => {console.log(response.statusCode);});
    },

  //   function () {
      
  //     // wipe local db
  //     console.log("Started wiping database");
      
  //     const collections = mongoose.connection.collections

  //     for (const key in collections) {

  //       const collection = collections[key];
  //       collection.deleteMany({});

  //     }

  //     console.log("Finished wiping database");

  //   },

  //   // Authorise the user before running tests
  //   async function() {

  //     // Create new user
  //     // In the future we'll create an admin user and a normal user for the tests
  //     // TODO get this url from env
  //     return await request(app).post(`/auth/register`)
  //     .send({
  //       email: "admin@test.co.uk",
  //       name: "Admin",
  //       surname: "User",
  //       password: "password",
  //       username: "admin"
  //     }).then((response) => {
  //       console.log(response.status);
  //       console.log("Finished creating new user");
  //       process.env.authToken = response.body.tokens.at;
  //       console.log(process.env.authToken);
  //     }).catch((error) => {
  //       console.error(error);
  //     });

  //   }
  // ],
};
