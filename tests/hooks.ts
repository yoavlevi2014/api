import db from "@db";
import axios from "axios";
// import app from "index";
import mongoose from "mongoose";

export const mochaHooks = {

  beforeAll: [
    
    // Connect to the database before running tests
    async function () {
      await db();
    },

    async function () {
      
      // wipe local db
      
      const collections = mongoose.connection.collections

      for (const key in collections) {

        const collection = collections[key];
        await collection.deleteMany({});

      }

    },

    // Authorise the user before running tests
    async function() {

      // Create new user
      // In the future we'll create an admin user and a normal user for the tests
      // TODO get this url from env
      await axios.post(`http://localhost:8080/auth/register`,
      {
        email: "admin@test.co.uk",
        name: "Admin",
        surname: "User",
        password: "password",
        username: "admin"
      }).then((response) => {
        console.log(response.status);
        process.env.authToken = response.data.tokens.at;
        console.log(process.env.authToken);
      }).catch((error) => {
        console.error(error);
      });

    }
  ],
};
