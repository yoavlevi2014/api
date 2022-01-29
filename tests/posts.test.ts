import request from "supertest";
import app from "@index";
import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "@models/user";
import { Post } from "@models/post";

let authTokenOne: string;
let authTokenTwo: string;
let userOne: User;
let userTwo: User;

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
  
  // Create two users so we can test accessing posts for specific users
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
  
          authTokenOne = response.body.tokens.at;
          userOne = response.body.user;

          request(app).post(`/auth/register`)
          .send({
            email: "usertwo@test.co.uk",
            name: "User",
            surname: "Two",
            password: "password",
            username: "UserTwo"
          }).end((error, response) => {
      
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
  
    request(app).post(`/posts`).set('Authorization', `Bearer ${authTokenOne}`)
      .send({
        author: userOne,
        title: "Post one",
        content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`
      }).end((error, response) => {
  
        if (response.status == 201) {

          request(app).post(`/posts`).set('Authorization', `Bearer ${authTokenTwo}`)
          .send({
            author: userTwo,
            title: "Post two",
            content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`
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
          
      });
  
  });

  it("GET /posts/ returns an array of correct size", (done) => {

    request(app)
      .get("/posts/").set('Authorization', `Bearer ${authTokenOne}`)
      .end((error, response) => {

        expect(response.status).to.eql(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.eql(2);

        done(error);

      });

  });

  it("GET /posts/user/ returns posts from the correct user", (done) => {

    request(app)
      .get("/posts/user/").set('Authorization', `Bearer ${authTokenOne}`)
      .send({
        user: userOne
      })
      .end((error, response) => {

        expect(response.status).to.eql(200);
        expect(response.body).to.be.an('array');
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
      likes: -1, // undefined
      created: -1, // undefined
      users: [userOne] // this gets defined on the server anyway but we need to give the model something
    }

    request(app).post(`/posts`).set('Authorization', `Bearer ${authTokenOne}`)
      .send({
        author: post.author,
        title: post.title,
        content: post.content
      }).end((error, response) => {
          
        expect(response.status).to.eql(201);
        expect(response.body.author).to.be.eql(post.author);
        expect(response.body.title).to.be.eql(post.title);
        expect(response.body.content).to.be.eql(post.content);
        expect(response.body.likes).to.be.eql(0);
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
      likes: -1, // undefined
      created: -1, // undefined
      users: [userOne] // this gets defined on the server anyway but we need to give the model something
    }

    request(app).post(`/posts`).set('Authorization', `Bearer ${authTokenOne}`)
      .send({
        title: post.title,
        content: post.content
      }).end((error, response) => {
          
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
      likes: -1, // undefined
      created: -1, // undefined
      users: [userOne] // this gets defined on the server anyway but we need to give the model something
    }

    request(app).post(`/posts`).set('Authorization', `Bearer ${authTokenOne}`)
      .send({
        author: post.author,
        content: post.content
      }).end((error, response) => {
          
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
      likes: -1, // undefined
      created: -1, // undefined
      users: [userOne] // this gets defined on the server anyway but we need to give the model something
    }

    request(app).post(`/posts`).set('Authorization', `Bearer ${authTokenOne}`)
      .send({
        author: post.author,
        title: post.title
      }).end((error, response) => {
          
        expect(response.status).to.eql(400);
        expect(response.body.error).to.be.eql("Post content is missing");

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
      username: "test"
  }

    const post: Post = {
      id: "undefined",
      author: newUser,
      title: "Post title",
      content: `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M881.1,132.5H118.9C59,132.5,10,181.5,10,241.4v517.3c0,59.9,49,108.9,108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V241.4C990,181.5,941,132.5,881.1,132.5z M949.2,747.3c0,54.9-24.5,79.4-79.4,79.4H130.3c-54.9,0-79.4-24.5-79.4-79.4V252.7c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,79.4V747.3z M316.3,418.3L418.3,500l265.4-224.6l204.2,183.8v306.3H112.1V581.7L316.3,418.3z M193.8,234.6c-45.1,0-81.7,36.6-81.7,81.7s36.6,81.7,81.7,81.7s81.7-36.6,81.7-81.7S238.9,234.6,193.8,234.6z"/></g></svg>`,
      likes: -1, // undefined
      created: -1, // undefined
      users: [newUser] // this gets defined on the server anyway but we need to give the model something
    }

    request(app).post(`/posts`).set('Authorization', `Bearer ${authTokenOne}`)
      .send({
        author: post.author,
        title: post.title,
        content: post.content
      }).end((error, response) => {
          
        expect(response.status).to.eql(400);
        expect(response.body.error).to.be.eql("Invalid user");

        done(error);

      });

  });

});