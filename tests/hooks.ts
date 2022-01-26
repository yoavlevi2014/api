import db from "@db";
import mongoose from "mongoose";

export const mochaHooks = {

  beforeAll: [
    
    // Connect to the database before running tests
    async function () {
      await db();
    },

  ],

  // Clean up the database after running tests
  afterAll: [

    function() {

      const collections = mongoose.connection.collections

      for (const key in collections) {

        const collection = collections[key];
        collection.deleteMany({});

      }

    }

  ]
 
};
