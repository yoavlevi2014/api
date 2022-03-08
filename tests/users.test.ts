import request from "supertest";
import app from "@index";
import { expect } from "chai";
import mongoose from "mongoose";

let authToken: string;

describe("Users", () => {

  before((done) => {

    // TODO make this better
    mongoose.connection.collections.users.drop(() => {
      mongoose.connection.collections.refreshes.drop(() => {
        mongoose.connection.collections.posts.drop(() => {
          done();
        });
      });
    });
  
  });
  
  before((done) => {
  
    request(app).post(`/auth/register`)
      .send({
        email: "admin@test.co.uk",
        name: "Admin",
        surname: "User",
        password: "password",
        username: "admin"
      }).end((error, response) => {
  
        if (response.statusCode == 201) {
  
          process.env.authToken = response.body.tokens.at;
  
        } else if (response.statusCode == 200) {
  
          console.log(response.body);
  
        }
  
        done(error);
          
      });
  
  });
  
  before((done) => {
  
    if (process.env.authToken  !== undefined) {
  
        authToken = process.env.authToken;
        done();
      
    } else {
      
      throw new Error("Auth token isn't set, exiting");
      
    }
  
  });

  it("GET /users/ returns an array of correct size", (done) => {

    request(app)
      .get("/users/").set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {

        expect(response.status).to.eql(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.eql(1);

        done(error);

      });

  });

  it("GET /users/name/:name returns the correct user", (done) => {

    request(app)
      .get("/users/name/admin").set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {

        expect(response.status).to.eql(200);
        expect(response.body.email).to.eql("admin@test.co.uk");
        expect(response.body.name).to.eql("Admin");
        expect(response.body.surname).to.eql("User");
        expect(response.body.username).to.eql("admin");

        done(error);

      });

  });

  // Friends and shit

  // ---Friends---


  // Send request (with all the right data)
  it("Send friend request", (done) => {});
  // Send request (permutations of missing data)
  it("Send friend request (missing current user)", (done) => {});
  it("Send friend request (missing user)", (done) => {});
  // Send request (permutations of bad data)
  it("Send friend request (current user doesn't exit)", (done) => {});
  it("Send friend request (user doesn't exist)", (done) => {});
  // Accept request (with all the right data)
  it("Accept friend request", (done) => {});
  // Accept request (permutations of missing data)
  it("Accept friend request (missing request id? not sure how i want to do this one)", (done) => {});
  // Accept request (permutations of bad data)
  it("Accept friend request (request id doesn't exist? not sure how i want to do this one)", (done) => {});
  // Decline request (with all the right data)
  it("Decline friend request", (done) => {});
  // Decline request (permutations of missing data)
  it("Decline friend request (missing request id? not sure how i want to do this one)", (done) => {});
  // Decline request (permutations of bad data)
  it("Decline friend request (request id doesn't exist? not sure how i want to do this one)", (done) => {});
  // Remove request (with all the right data)
  it("Remove friend request", (done) => {});
  // Remove request (permutations of missing data)
  it("Remove friend request (request id doesn't exist? not sure how i want to do this one)", (done) => {});
  // Remove request (permutations of bad data)
  it("Remove friend request (request id doesn't exist? not sure how i want to do this one)", (done) => {});
  // Remove friend (with all the right data)
  // Remove friend (permutations of missing data)
  // Remove friend (permutations of bad data)
  // Send message (with all the right data)
  // Send message (permutations of missing data)
  // Send message (permutations of bad data)
  // Number of friends (with all the right data)
  // Number of friends (permutations of missing data)
  // Number of friends (permutations of bad data)
  // List of friends (with all the right data)
  // List of friends (permutations of missing data)
  // List of friends (permutations of bad data)
  // List of invites (with all the right data)
  // List of invites (permutations of missing data)
  // List of invites (permutations of bad data)

  // ---Following---

  // Follow (with all the right data)
  // Follow (permutations of missing data)
  // Follow (permutations of bad data)
  // Unfollow (with all the right data)
  // Unfollow (permutations of missing data)
  // Unfollow (permutations of bad data)
  // Number of following (with all the right data)
  // Number of following (permutations of missing data)
  // Number of following (permutations of bad data)
  // List of following (with all the right data)
  // List of following (permutations of missing data)
  // List of following (permutations of bad data)
  // List of posts from following (with all the right data)
  // List of posts from following (permutations of missing data)
  // List of posts from following (permutations of bad data)

  // ---Followers---
  
  // Number of followers (with all the right data)
  // Number of followers (permutations of missing data)
  // Number of followers (permutations of bad data)
  // List of followers (with all the right data)
  // List of followers (permutations of missing data)
  // List of followers (permutations of bad data)

});