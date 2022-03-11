import request from "supertest";
import app from "@index";
import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "@models/user";

let authToken: string;
let UserOne: User;
let UserTwo: User;

describe("Users", () => {

  before((done) => {

    // TODO make this better
    mongoose.connection.collections.users.drop(() => {
      mongoose.connection.collections.refreshes.drop(() => {
        mongoose.connection.collections.posts.drop(() => {
          mongoose.connection.collections.friend_requests.drop(() => {
            done();
          });
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

  // TODO merge with function above
  before((done) => {

    request(app).post(`/auth/register`)
      .send({
        email: "userone@test.co.uk",
        name: "User",
        surname: "One",
        password: "password",
        username: "UserOne"
      }).end((error, response) => {
  
        if (response.statusCode == 201) {

          UserOne = response.body.user;

          request(app).post(`/auth/register`)
          .send({
            email: "usertwo@test.co.uk",
            name: "User",
            surname: "Two",
            password: "password",
            username: "UserTwo"
          }).end((error, response) => {

            UserTwo = response.body.user;
      
            done(error);
              
          });
  
        } else {
  
          done(error);

        }
          
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
        expect(response.body.length).to.eql(3);

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

  it("Send friend request", (done) => {

    request(app).post("/users/friends/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": UserOne.username,
          "to": UserTwo.username
        }
      ).end((error, response) => {

        expect(response.status).to.eql(201);
        // more shit here

        done(error);

      });

  });

  it("Send friend request (request already exists)", (done) => {
    
    request(app).post("/users/friends/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": UserOne.username,
          "to": UserTwo.username
        }
      ).end((error, response) => {

        expect(response.status).to.eql(403);
        // more shit here

        done(error);

      });

  });

  it("Send friend request (missing from username)", (done) => {
    
    request(app).post("/users/friends/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "to": UserTwo.username
        }
      ).end((error, response) => {

        expect(response.status).to.eql(400);
        // more shit here

        done(error);

      });

  });

  it("Send friend request (missing to username)", (done) => {
    
    request(app).post("/users/friends/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": UserOne.username
        }
      ).end((error, response) => {

        expect(response.status).to.eql(400);
        // more shit here

        done(error);

      });

  });

  it("Send friend request (invalid to user)", (done) => {
    
    request(app).post("/users/friends/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "to": "InvalidUsername",
          "from": UserTwo.username
        }
      ).end((error, response) => {

        expect(response.status).to.eql(404);
        // more shit here

        done(error);

      });

  });

  it("Send friend request (invalid from user)", (done) => {
    
    request(app).post("/users/friends/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "to": UserOne.username,
          "from": "InvalidUsername"
        }
      ).end((error, response) => {

        expect(response.status).to.eql(404);
        // more shit here

        done(error);

      });

  });

  it("Send friend request (To user is the same as from user)", (done) => {
    
    request(app).post("/users/friends/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "to": UserOne.username,
          "from": UserOne.username
        }
      ).end((error, response) => {

        expect(response.status).to.eql(403);
        // more shit here

        done(error);

      });

  });

  it("Get all friend requests", (done) => {
    
    request(app).get("/users/friends/requests").set('Authorization', `Bearer ${authToken}`)
    .end((error, response) => {
      
        expect(response.status).to.eql(200);
        expect(response.body.length).to.eql(1);
        expect(response.body).to.be.an("array");

        done(error);

      });

  });

  // // Accept request (with all the right data)
  // it("Accept friend request", (done) => {});
  // // Accept request (permutations of missing data)
  // it("Accept friend request (missing request id? not sure how i want to do this one)", (done) => {});
  // // Accept request (permutations of bad data)
  // it("Accept friend request (request id doesn't exist? not sure how i want to do this one)", (done) => {});
  // // Decline request (with all the right data)
  // it("Decline friend request", (done) => {});
  // // Decline request (permutations of missing data)
  // it("Decline friend request (missing request id? not sure how i want to do this one)", (done) => {});
  // // Decline request (permutations of bad data)
  // it("Decline friend request (request id doesn't exist? not sure how i want to do this one)", (done) => {});
  // // Remove request (with all the right data)
  // it("Remove friend request", (done) => {});
  // // Remove request (permutations of missing data)
  // it("Remove friend request (request id doesn't exist? not sure how i want to do this one)", (done) => {});
  // // Remove request (permutations of bad data)
  // it("Remove friend request (request id doesn't exist? not sure how i want to do this one)", (done) => {});
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