import request from "supertest";
import app from "@index";
import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "@models/user";

let authToken: string;
let admin: User;
let UserOne: User;
let UserTwo: User;
let UserOneDupe: User;

// used for the accept friend request test
let friend_request_id: string;

let canvas_request_id: string;

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
    request(app)
      .post(`/auth/register`)
      .send({
        email: "admin@test.co.uk",
        name: "Admin",
        surname: "User",
        password: "password",
        username: "admin",
      })
      .end((error, response) => {
        if (response.statusCode == 201) {
          process.env.authToken = response.body.tokens.at;
          admin = response.body.user;
        } else if (response.statusCode == 200) {
          console.log(response.body);
        }

        done(error);
      });
  });

  // TODO merge with function above
  before((done) => {
    request(app)
      .post(`/auth/register`)
      .send({
        email: "userone@test.co.uk",
        name: "User",
        surname: "One",
        password: "password",
        username: "UserOne",
      })
      .end((error, response) => {
        if (response.statusCode == 201) {
          UserOne = response.body.user;

          request(app)
            .post(`/auth/register`)
            .send({
              email: "usertwo@test.co.uk",
              name: "User",
              surname: "Two",
              password: "password",
              username: "UserTwo",
            })
            .end((error, response) => {
              UserTwo = response.body.user;

              done(error);
            });
        } else {
          done(error);
        }
      });
  });

  // create 2 posts under userOne
  before((done) => {
    request(app).post(`/posts`).set('Authorization', `Bearer ${authToken}`)
      .send({
        author: UserOne,
        title: "Post one",
        content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
        size: "square"
      }).end((error, response) => {

        // Adds a tiny delay here otherwise they have the same timestamp and sorting doesn't work
        setTimeout(() => {

          if (response.status == 201) {

            request(app).post(`/posts`).set('Authorization', `Bearer ${authToken}`)
              .send({
                author: UserOne,
                title: "Post two",
                content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
                size: "square"
              }).end((error, response) => {

                if (response.status == 201) {

                  done();

                } else {

                  done(error);

                }

              });

          } else {

            done(error);

          }

        }, 1000);

      });
  });

  // apologies, above function was messing with other tests when I edited that one
  before((done) => {
    request(app)
      .post(`/auth/register`)
      .send({
        email: "useronedupe@test.co.uk",
        name: "User",
        surname: "One",
        password: "password",
        username: "UserOneDupe",
      })
      .end((error, response) => {
        if (response.statusCode == 201) {
          UserOneDupe = response.body.user;

          done(error);
        } else {
          done(error);
        }
      });
  });

  before((done) => {
    if (process.env.authToken !== undefined) {
      authToken = process.env.authToken;
      done();
    } else {
      throw new Error("Auth token isn't set, exiting");
    }

  });

  it("GET /users/ returns an array of correct size", (done) => {
    request(app)
      .get("/users/")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.eql(4);

        done(error);
      });
  });

  it("GET /users/name/:name returns the correct user", (done) => {
    request(app)
      .get("/users/name/admin")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body.email).to.eql("admin@test.co.uk");
        expect(response.body.name).to.eql("Admin");
        expect(response.body.surname).to.eql("User");
        expect(response.body.username).to.eql("admin");

        done(error);
      });
  });

  it("GET /users/search returns correct matches (part one)", (done) => {
    request(app)
      .get("/users/search/User")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.body.length).to.eql(3);
        expect(response.status).to.eql(200);
        expect(response.body[0].username).to.eql("UserOne");
        expect(response.body[1].username).to.eql("UserTwo");

        done(error);
      });
  });

  it("GET /users/search returns correct matches (part two)", (done) => {
    request(app)
      .get("/users/search/Adm")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.body.length).to.eql(1);
        expect(response.status).to.eql(200);
        expect(response.body[0].username).to.eql("admin");

        done(error);
      });
  });

  it("GET /users/search errors if too few characters are supplied", (done) => {
    request(app)
      .get("/users/search/a")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.body.error).to.eql("Too few characters supplied");
        expect(response.status).to.eql(400);

        done(error);
      });
  });

  it("GET /users/search errors if no characters are supplied", (done) => {
    request(app)
      .get("/users/search/")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(404);

        done(error);
      });
  });

  //TODO add test to check for no more than 4 results

  // Friends and stuff

  // ---Friends---

  it("Send friend request", (done) => {
    request(app)
      .post("/users/friends/request")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        from: UserOne.username,
        to: UserTwo.username,
      })
      .end((error, response) => {
        expect(response.status).to.eql(201);
        // more stuff here

        friend_request_id = response.body.request_id;

        done(error);
      });
  });

  it("Send friend request (request already exists)", (done) => {
    request(app)
      .post("/users/friends/request")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        from: UserOne.username,
        to: UserTwo.username,
      })
      .end((error, response) => {
        expect(response.status).to.eql(403);
        // more stuff here

        done(error);
      });
  });

  it("Send friend request (missing from username)", (done) => {
    request(app)
      .post("/users/friends/request")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        to: UserTwo.username,
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        // more stuff here

        done(error);
      });
  });

  it("Send friend request (missing to username)", (done) => {
    request(app)
      .post("/users/friends/request")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        from: UserOne.username,
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        // more stuff here

        done(error);
      });
  });

  it("Send friend request (invalid to user)", (done) => {
    request(app)
      .post("/users/friends/request")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        to: "InvalidUsername",
        from: UserTwo.username,
      })
      .end((error, response) => {
        expect(response.status).to.eql(404);
        // more stuff here

        done(error);
      });
  });

  it("Send friend request (invalid from user)", (done) => {
    request(app)
      .post("/users/friends/request")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        to: UserOne.username,
        from: "InvalidUsername",
      })
      .end((error, response) => {
        expect(response.status).to.eql(404);
        // more stuff here

        done(error);
      });
  });

  it("Send friend request (To user is the same as from user)", (done) => {
    request(app)
      .post("/users/friends/request")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        to: UserOne.username,
        from: UserOne.username,
      })
      .end((error, response) => {
        expect(response.status).to.eql(403);
        // more stuff here

        done(error);
      });
  });

  it("Get all friend requests", (done) => {
    request(app)
      .get("/users/friends/requests")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body.length).to.eql(1);
        expect(response.body).to.be.an("array");

        done(error);
      });
  });

  it("List all a user's friend requests", (done) => {
    request(app)
      .get("/users/friends/UserOne/requests")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body.length).to.eql(1);
        expect(response.body).to.be.an("array");

        done(error);
      });
  });

  it("List all a user's friend requests (user doesn't exist)", (done) => {
    request(app)
      .get("/users/friends/aaaaa/requests")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(404);
        expect(response.body.error).to.eql("User doesn't exist");

        done(error);
      });
  });

  it("List all a user's sent friend requests", (done) => {
    request(app)
      .get("/users/friends/UserOne/requests/from")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body.length).to.eql(1);
        expect(response.body).to.be.an("array");

        done(error);
      });
  });

  it("List all a user's sent friend requests (user doesn't exist)", (done) => {
    request(app)
      .get("/users/friends/aaaa/requests/from")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(404);
        expect(response.body.error).to.eql("User doesn't exist");

        done(error);
      });
  });

  it("List all a user's sent friend requests (no user supplied)", (done) => {
    request(app)
      .get("/users/friends/aaaa/requests/from")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(404);

        done(error);
      });
  });

  it("List all a user's incoming friend requests", (done) => {
    request(app)
      .get("/users/friends/UserOne/requests/to")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body.length).to.eql(0);
        expect(response.body).to.be.an("array");

        done(error);
      });
  });

  it("List all a user's incoming friend requests (user doesn't exist)", (done) => {
    request(app)
      .get("/users/friends/aaaa/requests/to")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(404);
        expect(response.body.error).to.eql("User doesn't exist");

        done(error);
      });
  });

  it("List all a user's incoming friend requests (no user supplied)", (done) => {
    request(app)
      .get("/users/friends/requests/to")
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(404);

        done(error);
      });
  });

  it("Accept friend request", (done) => {
    request(app)
      .post(`/users/friends/request/accept/${friend_request_id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);

        request(app)
          .get("/users/name/UserOne")
          .set("Authorization", `Bearer ${authToken}`)
          .end((error, response) => {
            expect(response.body.friends.length).to.eql(1);
            expect(response.body.friends[0]).to.eql("UserTwo");

            request(app)
              .get("/users/name/UserTwo")
              .set("Authorization", `Bearer ${authToken}`)
              .end((error, response) => {
                expect(response.body.friends.length).to.eql(1);
                expect(response.body.friends[0]).to.eql("UserOne");

                request(app)
                  .get("/users/friends/requests")
                  .set("Authorization", `Bearer ${authToken}`)
                  .end((error, response) => {
                    expect(response.status).to.eql(200);
                    expect(response.body.length).to.eql(0);
                    expect(response.body).to.be.an("array");

                    done(error);
                  });

                if (error) done(error);
              });

            if (error) done(error);
          });

        if (error) done(error);
      });
  });

  it("Send friend request (Users are already friends)", (done) => {
    request(app)
      .post("/users/friends/request")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        from: UserOne.username,
        to: UserTwo.username,
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Users are already friends");

        done(error);
      });
  });

  it("Cancel friend request", (done) => {
    request(app)
      .post("/users/friends/request")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        from: admin.username,
        to: UserTwo.username,
      })
      .end((error, response) => {
        request(app)
          .post(`/users/friends/request/cancel/${response.body.request_id}`)
          .set("Authorization", `Bearer ${authToken}`)
          .end((error, response) => {
            expect(response.status).to.eql(200);

            done(error);
          });

        if (error) done(error);
      });
  });

  it("Add initial bio", (done) => {
    request(app)
      .post("/users/bio")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        bio: "Example bio",
        user_id: UserOne.id,
      })
      .end((error, response) => {
        expect(response.status).to.eql(201);
        expect(response.body.bio).to.eql("Example bio");

        done(error);
      });
  });

  it("Edit bio", (done) => {
    request(app)
      .post("/users/bio")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        bio: "Changed bio",
        user_id: UserOne.id,
      })
      .end((error, response) => {
        expect(response.status).to.eql(201);
        expect(response.body.bio).to.eql("Changed bio");

        done(error);
      });
  });

  it("Return error when no user_id is provided", (done) => {
    request(app)
      .post("/users/bio")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        bio: "Changed bio",
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("User ID is missing");

        done(error);
      });
  });

  it("Remove bio when no bio is provided", (done) => {
    request(app)
      .post("/users/bio")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        user_id: UserOne.id,
      })
      .end((error, response) => {
        expect(response.status).to.eql(201);
        expect(response.body.bio).to.eql("");

        done(error);
      });
  });

  it("Validate user profile ID's", (done) => {
    expect(UserOne.profileID).to.eql("user.one.1");
    expect(UserTwo.profileID).to.eql("user.two.1");
    expect(UserOneDupe.profileID).to.eql("user.one.2");
    done();
  });

  it("Send canvas request", (done) => {

    request(app).post("/users/canvas/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": UserOne.username,
          "to": UserTwo.username,
          "size": "Square",
          "roomID": "example"
        }
      ).end((error, response) => {

        expect(response.status).to.eql(201);
        expect(response.body.size).to.eql("Square");
        expect(response.body.roomID).to.eql("example");

        canvas_request_id = response.body.request_id;

        done(error);

      });

  });

  it("Send duplicate canvas request", (done) => {

    request(app).post("/users/canvas/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": UserOne.username,
          "to": UserTwo.username,
          "size": "Square",
          "roomID": "example"
        }
      ).end((error, response) => {

        expect(response.status).to.eql(403);
        expect(response.body.error).to.eql("Request already exists"); 

        done(error);

      });

  });

  it("Don't send canvas request when from is undefined", (done) => {

    request(app).post("/users/canvas/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "to": UserTwo.username,
          "size": "Square",
          "roomID": "example"
        }
      ).end((error, response) => {

        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("From user is missing"); 

        done(error);

      });

  });

  it("Don't send canvas request when to is undefined", (done) => {

    request(app).post("/users/canvas/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": UserOne.username,
          "size": "Square",
          "roomID": "example"
        }
      ).end((error, response) => {

        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("To user is missing"); 

        done(error);

      });

  });

  it("Don't send canvas request when size is undefined", (done) => {

    request(app).post("/users/canvas/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": UserOne.username,
          "to": UserTwo.username,
          "roomID": "example"
        }
      ).end((error, response) => {

        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("canvas size is missing"); 

        done(error);

      });

  });

  it("Don't send canvas request when room ID is undefined", (done) => {

    request(app).post("/users/canvas/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": UserOne.username,
          "to": UserTwo.username,
          "size": "Square",
        }
      ).end((error, response) => {

        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("room ID is missing"); 

        done(error);

      });

  });

  it("Correct number of canvas requests is returned", (done) => {

    request(app).get(`/users/canvas/${UserTwo.username}/request/to`).set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {

        expect(response.status).to.eql(200);
        expect(response.body.length).to.eql(1);
        expect(response.body).to.be.an("array");

        done(error);

      });

  });

  it("Accept canvas request", (done) => {

    request(app).post(`/users/canvas/request/accept/${canvas_request_id}`).set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {

        expect(response.status).to.eql(200);
        expect(response.body.request_id).to.eql(canvas_request_id);

        done(error);

      });

  });

  it("Cancel friend request", (done) => {

    request(app).post("/users/canvas/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": admin.username,
          "to": UserTwo.username,
          "size": "Square",
          "roomID": "example"
        }
      ).end((error, response) => {

        request(app).post(`/users/canvas/request/cancel/${response.body.request_id}`).set('Authorization', `Bearer ${authToken}`)
          .end((error, response) => {

            expect(response.status).to.eql(200);

            done(error);

          });

        if (error)
          done(error);

      });

  });
  // it("removing user with user ID", (done) => {
  //   request(app).post("/users/remove").set('Authorization', `Bearer ${authToken}`)
  //     .send(
  //       {
  //         user_id: UserOneDupe.id
  //       }
  //     ).end((error, response) => {

  //       expect(response.status).to.eql(200);

  //       done(error);
  //     })
  // });

  it("get profile of userOne", (done) => {
    request(app).get("/users/profile/user.one.1").set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {
        
        expect(response.status).to.eql(200);
        expect(response.body.user.username).to.eql("UserOne");
        expect(response.body.posts).to.be.an("array");
        done(error);

      })
  });

  it("get profile of userTwo", (done) => {
    request(app).get("/users/profile/user.two.1").set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {
        
        expect(response.status).to.eql(200);
        expect(response.body.user.username).to.eql("UserTwo");
        done(error);

      })
  });

  it("edit user", (done) => {
    request(app).put("/users/edit/UserOne").set('Authorization', `Bearer ${authToken}`)
      .send({
        id: UserOne.id,
        username: "NewUser",
        email: UserOne.email,
        name: UserOne.name,
        surname: UserOne.surname,
        profileID: UserOne.profileID
      })
      .end((error, response) => {
        
        expect(response.status).to.eql(200);
        console.log(response.body);
        done(error);

      })
  });
  // .....

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
