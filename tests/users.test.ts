import request from "supertest";
import app from "@index";
import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "@models/user";
import { Post } from "@models/post";
import { Comment } from "@models/comment";

let authToken: string;
let admin: User;
let UserOne: User;
let UserTwo: User;

// used for the accept friend request test
let friend_request_id: string;

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
          admin = response.body.user;
  
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

  it("GET /users/search returns correct matches (part one)", (done) => {

    request(app)
      .get("/users/search/User").set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {
  
        expect(response.body.length).to.eql(2);
        expect(response.status).to.eql(200);
        expect(response.body[0].username).to.eql("UserOne");
        expect(response.body[1].username).to.eql("UserTwo");
  
        done(error);
  
      });
  
  });

  it("GET /users/search returns correct matches (part two)", (done) => {

    request(app)
      .get("/users/search/Adm").set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {
  
        expect(response.body.length).to.eql(1);
        expect(response.status).to.eql(200);
        expect(response.body[0].username).to.eql("admin");
  
        done(error);
  
      });
  
  });

  it("GET /users/search errors if too few characters are supplied", (done) => {

    request(app)
      .get("/users/search/a").set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {
  
        expect(response.body.error).to.eql("Too few characters supplied");
        expect(response.status).to.eql(400);
  
        done(error);
  
      });
  
  });

  it("GET /users/search errors if no characters are supplied", (done) => {

    request(app)
      .get("/users/search/").set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {
  
        expect(response.status).to.eql(404);
  
        done(error);
  
      });
  
  });

  //TODO add test to check for no more than 4 results

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

        friend_request_id = response.body.request_id;

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

  it("List all a user's friend requests", (done) => {

    request(app).get("/users/friends/UserOne/requests").set('Authorization', `Bearer ${authToken}`)
    .end((error, response) => {
      
      expect(response.status).to.eql(200);
      expect(response.body.length).to.eql(1);
      expect(response.body).to.be.an("array");

      done(error);

    });

  });

  it("List all a user's friend requests (user doesn't exist)", (done) => {

    request(app).get("/users/friends/aaaaa/requests").set('Authorization', `Bearer ${authToken}`)
    .end((error, response) => {
      
      expect(response.status).to.eql(404);
      expect(response.body.error).to.eql("User doesn't exist");

      done(error);

    });

  });

  it("List all a user's sent friend requests", (done) => {

    request(app).get("/users/friends/UserOne/requests/from").set('Authorization', `Bearer ${authToken}`)
    .end((error, response) => {
      
      expect(response.status).to.eql(200);
      expect(response.body.length).to.eql(1);
      expect(response.body).to.be.an("array");

      done(error);

    });

  });

  it("List all a user's sent friend requests (user doesn't exist)", (done) => {

    request(app).get("/users/friends/aaaa/requests/from").set('Authorization', `Bearer ${authToken}`)
    .end((error, response) => {
      
      expect(response.status).to.eql(404);
      expect(response.body.error).to.eql("User doesn't exist");

      done(error);

    });

  });

  it("List all a user's sent friend requests (no user supplied)", (done) => {

    request(app).get("/users/friends/aaaa/requests/from").set('Authorization', `Bearer ${authToken}`)
    .end((error, response) => {
      
      expect(response.status).to.eql(404);

      done(error);

    });

  });
  
  it("List all a user's incoming friend requests", (done) => {

    request(app).get("/users/friends/UserOne/requests/to").set('Authorization', `Bearer ${authToken}`)
    .end((error, response) => {
      
      expect(response.status).to.eql(200);
      expect(response.body.length).to.eql(0);
      expect(response.body).to.be.an("array");

      done(error);

    });

  });

  it("List all a user's incoming friend requests (user doesn't exist)", (done) => {

    request(app).get("/users/friends/aaaa/requests/to").set('Authorization', `Bearer ${authToken}`)
    .end((error, response) => {
      
      expect(response.status).to.eql(404);
      expect(response.body.error).to.eql("User doesn't exist");

      done(error);

    });

  });

  it("List all a user's incoming friend requests (no user supplied)", (done) => {

    request(app).get("/users/friends/requests/to").set('Authorization', `Bearer ${authToken}`)
    .end((error, response) => {
      
      expect(response.status).to.eql(404);

      done(error);

    });

  });

  it("Accept friend request", (done) => {
    
    request(app).post(`/users/friends/request/accept/${friend_request_id}`).set('Authorization', `Bearer ${authToken}`)
    .end((error, response) => {
    
      expect(response.status).to.eql(200);
    
      request(app)
      .get("/users/name/UserOne").set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {
    
        expect(response.body.friends.length).to.eql(1);
        expect(response.body.friends[0]).to.eql("UserTwo");
    
        request(app)
        .get("/users/name/UserTwo").set('Authorization', `Bearer ${authToken}`)
        .end((error, response) => {
    
          expect(response.body.friends.length).to.eql(1);
          expect(response.body.friends[0]).to.eql("UserOne");
    
          request(app).get("/users/friends/requests").set('Authorization', `Bearer ${authToken}`)
          .end((error, response) => {
              
            expect(response.status).to.eql(200);
            expect(response.body.length).to.eql(0);
            expect(response.body).to.be.an("array");
              
            done(error);
    
          });
    
          if (error)
            done(error);
    
        });
    
        if (error)
          done(error);
    
      });
    
      if (error)
        done(error);

    });

  });

  it("Send friend request (Users are already friends)", (done) => {

    request(app).post("/users/friends/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": UserOne.username,
          "to": UserTwo.username
        }
      ).end((error, response) => {

        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Users are already friends");

        done(error);

      });

  });

  it("Cancel friend request", (done) => {

    request(app).post("/users/friends/request").set('Authorization', `Bearer ${authToken}`)
      .send(
        {
          "from": admin.username,
          "to": UserTwo.username
        }
      ).end((error, response) => {

        request(app).post(`/users/friends/request/cancel/${response.body.request_id}`).set('Authorization', `Bearer ${authToken}`)
        .end((error, response) => {

          expect(response.status).to.eql(200);

          done(error);

        });

        if (error)
          done(error);

      });

  });
  // .....

  it("TESSTTTT", (done) => {


    // Very long test but basically create two posts, one where our user is the author and one where our user is commenting

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
              author: UserTwo,
              title: "Post two",
              content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
              size: "square"
            }).end((error, response) => {
        
              if (response.status == 201) {
  
                request(app).get(`/posts`).set('Authorization', `Bearer ${authToken}`)
                .end((error, response) => {

                  if (error)
                    done(error);
                      
                  // We have to get the second post because of the default sorting order of GET /posts
                  const post: Post = response.body[1] as Post;

                  // Mocking up properties that will normally be set on the server
                  const comment: Comment = {

                    id: "",
                    author: UserOne,
                    content: "Comment one",
                    likes: 0,
                    created: 0,
                    isOnOwnPost: true,
                    post_id: post.id

                  };

                  request(app).post(`/posts/comment`).set('Authorization', `Bearer ${authToken}`)
                  .send({
                    author: comment.author,
                    content: comment.content,
                    post_id: comment.post_id
                  }).end((error) => {

                    request(app).get(`/users/profile/${UserOne.username}`).set('Authorization', `Bearer ${authToken}`)
                    .end((error, response) => {

                      expect(response.status).to.eql(200);
                      console.log(response.body);

                      done(error);

                    });

                    if (error)
                      done(error);

                  });

                });

              }

              if (error)
                done(error);
                
            });

          }

        }, 1000);

        if (error)
          done(error);

      });

  });

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