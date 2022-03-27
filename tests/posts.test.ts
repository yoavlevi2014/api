import request from "supertest";
import app from "@index";
import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "@models/user";
import { Post } from "@models/post";
import { Comment } from "@models/comment";

let authToken: string;
let authTokenOne: string;
let authTokenTwo: string;
let admin: User;
let userOne: User;
let userTwo: User;

let post_id_one: string;

describe("Posts", () => {
  // Wipe database before running any tests
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

  before((done) => {
    if (process.env.authToken !== undefined) {
      authToken = process.env.authToken;
      done();
    } else {
      throw new Error("Auth token isn't set, exiting");
    }

    mongoose.connection.collections.users.findOneAndUpdate(
      { id: admin.id },
      { admin: true }
    );
  });

  // Create two users so we can test accessing posts for specific users
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
          authTokenOne = response.body.tokens.at;
          userOne = response.body.user;

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
              if (response.statusCode == 201) {
                authTokenTwo = response.body.tokens.at;
                userTwo = response.body.user;
              }

              done(error);
            });
        } else {
          done(error);
        }
      });
  });

  // Create two posts
  before((done) => {
    request(app)
      .post(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .send({
        author: userOne,
        title: "Post one",
        content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
        size: "square",
      })
      .end((error, response) => {
        post_id_one = response.body.id;

        // Adds a tiny delay here otherwise they have the same timestamp and sorting doesn't work
        setTimeout(() => {
          if (response.status == 201) {
            request(app)
              .post(`/posts`)
              .set("Authorization", `Bearer ${authTokenTwo}`)
              .send({
                author: userTwo,
                title: "Post two",
                content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
                size: "square",
              })
              .end((error, response) => {
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

  it("GET /posts/ returns an array of correct size", (done) => {
    request(app)
      .get("/posts/")
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.eql(2);

        done(error);
      });
  });

  it("GET /posts/ with no supplied sorting order defaults to sort by new", (done) => {
    request(app)
      .get("/posts/")
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.eql(2);
        // Post two was made last so should be at the start of the array
        expect(response.body[0].title).to.eql("Post two");
        expect(response.body[1].title).to.eql("Post one");

        done(error);
      });
  });

  it("GET /posts/ with invalid sorting order defaults to sort by new", (done) => {
    request(app)
      .get("/posts?sortby=test/")
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.eql(2);
        // Post two was made last so should be at the start of the array
        expect(response.body[0].title).to.eql("Post two");
        expect(response.body[1].title).to.eql("Post one");

        done(error);
      });
  });

  it("GET /posts?sortby=new", (done) => {
    request(app)
      .get("/posts?sortby=new/")
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.eql(2);
        // Post two was made last so should be at the start of the array
        expect(response.body[0].title).to.eql("Post two");
        expect(response.body[1].title).to.eql("Post one");

        done(error);
      });
  });

  // Unimplemented because there isn't a way to change the score yet
  // it("GET /posts?sortby=top/");

  //TODO date range options

  it("GET /posts/user/ returns posts from the correct user", (done) => {
    request(app)
      .get("/posts/user/")
      .set("Authorization", `Bearer ${authTokenOne}`)
      .send({
        user: userOne,
      })
      .end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.eql(1);
        expect(response.body[0].author.id).to.eql(userOne.id);
        expect(response.body[0].title).to.eql("Post one");

        done(error);
      });
  });

  it("Create new post", (done) => {
    const post: Post = {
      id: "undefined",
      author: userOne,
      title: "Post three",
      content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
      created: -1, // undefined
      users: [userOne], // this gets defined on the server anyway but we need to give the model something
      size: "square",
    };

    request(app)
      .post(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .send({
        author: post.author,
        title: post.title,
        content: post.content,
        size: post.size,
      })
      .end((error, response) => {
        expect(response.status).to.eql(201);
        expect(response.body.author).to.be.eql(post.author);
        expect(response.body.title).to.be.eql(post.title);
        expect(response.body.content).to.be.eql(post.content);
        expect(response.body.users).to.be.eql([userOne]);

        done(error);
      });
  });

  it("Dont't create new post with missing author", (done) => {
    const post: Post = {
      id: "undefined",
      author: userOne, // We have to set it here but we don't send it in the request
      title: "Post title",
      content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
      created: -1, // undefined
      users: [userOne], // this gets defined on the server anyway but we need to give the model something
      size: "square",
    };

    request(app)
      .post(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .send({
        title: post.title,
        content: post.content,
        size: post.size,
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.be.eql("Author is missing");

        done(error);
      });
  });

  it("Don't create new post with missing title", (done) => {
    const post: Post = {
      id: "undefined",
      author: userOne,
      title: "undefined",
      content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
      created: -1, // undefined
      users: [userOne], // this gets defined on the server anyway but we need to give the model something
      size: "square",
    };

    request(app)
      .post(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .send({
        author: post.author,
        content: post.content,
        size: post.size,
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.be.eql("Post title is missing");

        done(error);
      });
  });

  it("Don't create new post with missing content", (done) => {
    const post: Post = {
      id: "undefined",
      author: userOne,
      title: "Post title",
      content: "undefined",
      created: -1, // undefined
      users: [userOne], // this gets defined on the server anyway but we need to give the model something
      size: "square",
    };

    request(app)
      .post(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .send({
        author: post.author,
        title: post.title,
        size: post.size,
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.be.eql("Post content is missing");

        done(error);
      });
  });

  it("Don't create new post with missing size", (done) => {
    const post: Post = {
      id: "undefined",
      author: userOne,
      title: "Post title",
      content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
      created: -1, // undefined
      users: [userOne], // this gets defined on the server anyway but we need to give the model something
      size: "undefined",
    };

    request(app)
      .post(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .send({
        author: post.author,
        content: post.content,
        title: post.title,
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.be.eql("Post size is missing");

        done(error);
      });
  });

  it("Don't create new post with invalid user", (done) => {
    const newUser: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "Test",
      surname: "User",
      password: "password",
      username: "test",
      profileID: "",
    };

    const post: Post = {
      id: "undefined",
      author: newUser,
      title: "Post title",
      content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
      created: -1, // undefined
      users: [newUser], // this gets defined on the server anyway but we need to give the model something
      size: "square",
    };

    request(app)
      .post(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .send({
        author: post.author,
        title: post.title,
        content: post.content,
        size: post.size,
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.be.eql("Invalid user");

        done(error);
      });
  });

  it("Add first comment to a post", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        if (error) done(error);

        // We have to get the second post because of the default sorting order of GET /posts
        const post: Post = response.body[1] as Post;

        // Mocking up properties that will normally be set on the server
        const comment: Comment = {
          id: "",
          author: userTwo,
          content: "Comment one",
          likes: 0,
          created: 0,
          isOnOwnPost: false,
          post_id: post.id,
        };

        request(app)
          .post(`/posts/comment`)
          .set("Authorization", `Bearer ${authTokenOne}`)
          .send({
            author: comment.author,
            content: comment.content,
            post_id: comment.post_id,
          })
          .end((error, response) => {
            expect(response.status).to.eql(201);
            expect(response.body.comments).to.be.an("array");
            expect(response.body.comments.length).to.eql(1);
            expect(response.body.comments[0].author.username).to.eql(
              userTwo.username
            );
            expect(response.body.comments[0].content).to.eql("Comment one");
            expect(response.body.comments[0].isOnOwnPost).to.eql(false);

            done(error);
          });
      });
  });

  it("Add second comment to a post", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        if (error) done(error);

        // We have to get the second post because of the default sorting order of GET /posts
        const post: Post = response.body[1] as Post;

        // Mocking up properties that will normally be set on the server
        const comment: Comment = {
          id: "",
          author: userTwo,
          content: "Comment two",
          likes: 0,
          created: 0,
          isOnOwnPost: false,
          post_id: post.id,
        };

        request(app)
          .post(`/posts/comment`)
          .set("Authorization", `Bearer ${authTokenOne}`)
          .send({
            author: comment.author,
            content: comment.content,
            post_id: comment.post_id,
          })
          .end((error, response) => {
            expect(response.status).to.eql(201);
            expect(response.body.comments).to.be.an("array");
            expect(response.body.comments.length).to.eql(2);
            expect(response.body.comments[0].author.username).to.eql(
              userTwo.username
            );
            expect(response.body.comments[0].content).to.eql("Comment one");
            expect(response.body.comments[0].isOnOwnPost).to.eql(false);
            expect(response.body.comments[1].author.username).to.eql(
              userTwo.username
            );
            expect(response.body.comments[1].content).to.eql("Comment two");
            expect(response.body.comments[1].isOnOwnPost).to.eql(false);

            done(error);
          });
      });
  });

  it("Add comment to a post as the author", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        if (error) done(error);

        // We have to get the second post because of the default sorting order of GET /posts
        const post: Post = response.body[1] as Post;

        // Mocking up properties that will normally be set on the server
        const comment: Comment = {
          id: "",
          author: userOne,
          content: "Author comment",
          likes: 0,
          created: 0,
          isOnOwnPost: false,
          post_id: post.id,
        };

        request(app)
          .post(`/posts/comment`)
          .set("Authorization", `Bearer ${authTokenOne}`)
          .send({
            author: comment.author,
            content: comment.content,
            post_id: comment.post_id,
          })
          .end((error, response) => {
            expect(response.status).to.eql(201);
            expect(response.body.comments[2].author.username).to.eql(
              userOne.username
            );
            expect(response.body.comments[2].content).to.eql("Author comment");
            expect(response.body.comments[2].isOnOwnPost).to.eql(true);

            done(error);
          });
      });
  });

  it("Don't add a comment to an invalid post", (done) => {
    // Mocking up properties that will normally be set on the server
    const comment: Comment = {
      id: "",
      author: userTwo,
      content: "Comment one",
      likes: 0,
      created: 0,
      isOnOwnPost: false,
      post_id: "invalid-post-id",
    };

    request(app)
      .post(`/posts/comment`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .send({
        author: comment.author,
        content: comment.content,
        post_id: comment.post_id,
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Invalid post");

        done(error);
      });
  });

  it("Don't add a comment with an invalid user", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        if (error) done(error);

        // We have to get the second post because of the default sorting order of GET /posts
        const post: Post = response.body[1] as Post;

        // Create invalid user for testing
        const newUser: User = {
          id: "undefined",
          email: "test@test.co.uk",
          name: "Test",
          surname: "User",
          password: "password",
          username: "test",
          profileID: "",
        };

        // Mocking up properties that will normally be set on the server
        const comment: Comment = {
          id: "",
          author: newUser,
          content: "Comment one",
          likes: 0,
          created: 0,
          isOnOwnPost: false,
          post_id: post.id,
        };

        request(app)
          .post(`/posts/comment`)
          .set("Authorization", `Bearer ${authTokenOne}`)
          .send({
            author: comment.author,
            content: comment.content,
            post_id: comment.post_id,
          })
          .end((error, response) => {
            expect(response.status).to.eql(400);
            expect(response.body.error).to.eql("Invalid user");

            done(error);
          });
      });
  });

  //Author, comment, post_id

  it("Don't create a comment with missing author", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        if (error) done(error);

        // We have to get the second post because of the default sorting order of GET /posts
        const post: Post = response.body[1] as Post;

        // Mocking up properties that will normally be set on the server
        const comment: Comment = {
          id: "",
          author: userOne,
          content: "Comment",
          likes: 0,
          created: 0,
          isOnOwnPost: false,
          post_id: post.id,
        };

        request(app)
          .post(`/posts/comment`)
          .set("Authorization", `Bearer ${authTokenOne}`)
          .send({
            content: comment.content,
            post_id: comment.post_id,
          })
          .end((error, response) => {
            expect(response.status).to.eql(400);
            expect(response.body.error).to.eql("Author is missing");

            done(error);
          });
      });
  });

  it("Don't create a comment with missing comment", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        if (error) done(error);

        // We have to get the second post because of the default sorting order of GET /posts
        const post: Post = response.body[1] as Post;

        // Mocking up properties that will normally be set on the server
        const comment: Comment = {
          id: "",
          author: userOne,
          content: "Comment",
          likes: 0,
          created: 0,
          isOnOwnPost: false,
          post_id: post.id,
        };

        request(app)
          .post(`/posts/comment`)
          .set("Authorization", `Bearer ${authTokenOne}`)
          .send({
            author: comment.author,
            post_id: comment.post_id,
          })
          .end((error, response) => {
            expect(response.status).to.eql(400);
            expect(response.body.error).to.eql("Comment is missing");

            done(error);
          });
      });
  });

  it("Don't create a comment with missing post id", (done) => {
    // Mocking up properties that will normally be set on the server
    const comment: Comment = {
      id: "",
      author: userOne,
      content: "Comment",
      likes: 0,
      created: 0,
      isOnOwnPost: false,
      post_id: "undefined",
    };

    request(app)
      .post(`/posts/comment`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .send({
        author: comment.author,
        content: comment.content,
      })
      .end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Post id is missing");

        done(error);
      });
  });

  it("Add first like to a post", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        if (error) done(error);

        // We have to get the second post because of the default sorting order of GET /posts
        const post: Post = response.body[1] as Post;
        const user = userOne;

        request(app)
          .post(`/posts/like`)
          .set("Authorization", `Bearer ${authTokenOne}`)
          .send({
            user: user,
            post_id: post.id,
          })
          .end((error, response) => {
            expect(response.status).to.eql(201);
            expect(response.body.likes).to.be.an("array");
            expect(response.body.likes[0]).to.eql(user.username);

            done(error);
          });
      });
  });

  it("Add second like to a post", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenTwo}`)
      .end((error, response) => {
        if (error) done(error);

        // We have to get the second post because of the default sorting order of GET /posts
        const post: Post = response.body[1] as Post;
        const user = userTwo;

        request(app)
          .post(`/posts/like`)
          .set("Authorization", `Bearer ${authTokenTwo}`)
          .send({
            user: user,
            post_id: post.id,
          })
          .end((error, response) => {
            expect(response.status).to.eql(201);
            expect(response.body.likes[0]).to.eql(userOne.username);
            expect(response.body.likes[1]).to.eql(user.username);

            done(error);
          });
      });
  });

  it("Don't like if post ID is missing", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error) => {
        if (error) done(error);

        const user = userTwo;

        request(app)
          .post(`/posts/like`)
          .set("Authorization", `Bearer ${authTokenOne}`)
          .send({
            user: user,
          })
          .end((error, response) => {
            expect(response.status).to.eql(400);
            expect(response.body.error).to.eql("Post ID is missing");

            done(error);
          });
      });
  });

  it("Don't like if user is missing", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        if (error) done(error);

        const post: Post = response.body[1] as Post;

        request(app)
          .post(`/posts/like`)
          .set("Authorization", `Bearer ${authTokenOne}`)
          .send({
            post_id: post.id,
          })
          .end((error, response) => {
            expect(response.status).to.eql(400);
            expect(response.body.error).to.eql("User is missing");

            done(error);
          });
      });
  });

  it("Unlike a post", (done) => {
    request(app)
      .get(`/posts`)
      .set("Authorization", `Bearer ${authTokenOne}`)
      .end((error, response) => {
        if (error) done(error);

        // We have to get the second post because of the default sorting order of GET /posts
        const post: Post = response.body[1] as Post;
        const user = userOne;

        expect(post.likes?.includes(user.username)).to.be.eql(true);

        request(app)
          .post(`/posts/like`)
          .set("Authorization", `Bearer ${authTokenOne}`)
          .send({
            user: user,
            post_id: post.id,
          })
          .end((error, response) => {
            expect(response.status).to.eql(201);
            expect(response.body.likes).to.be.an("array");
            expect(response.body.likes[0]).to.not.eql(user.username);

            done(error);
          });
      });
  });

  //   it("Remove a post", (done) => {
  //     request(app).post("/posts/remove").set('Authorization', `Bearer ${authToken}`)
  //       .send({
  //         post_id: post_id_one,
  //       }).end((error, response) => {

  //         expect(response.status).to.eql(200);

  //         done(error);

  //       })
  //   });
});
