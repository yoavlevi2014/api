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

          request(app).post(`/auth/register`)
          .send({
            email: "usertwo@test.co.uk",
            name: "User",
            surname: "Two",
            password: "password",
            username: "UserTwo"
          }).end((error) => {
      
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
      .get("/users/search").set('Authorization', `Bearer ${authToken}`)
      .send({
        query: "User"
      })
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
      .get("/users/search").set('Authorization', `Bearer ${authToken}`)
      .send({
        query: "Adm"
      })
      .end((error, response) => {
  
        expect(response.body.length).to.eql(1);
        expect(response.status).to.eql(200);
        expect(response.body[0].username).to.eql("admin");
  
        done(error);
  
      });
  
  });

  it("GET /users/search errors if too few characters are supplied", (done) => {

    request(app)
      .get("/users/search").set('Authorization', `Bearer ${authToken}`)
      .send({
        query: "A"
      })
      .end((error, response) => {
  
        expect(response.body.error).to.eql("Too few characters supplied");
        expect(response.status).to.eql(400);
  
        done(error);
  
      });
  
  });

  it("GET /users/search errors if no characters are supplied", (done) => {

    request(app)
      .get("/users/search").set('Authorization', `Bearer ${authToken}`)
      .end((error, response) => {
  
        expect(response.body.error).to.eql("No characters supplied");
        expect(response.status).to.eql(400);
  
        done(error);
  
      });
  
  });

  //TODO add test to check for no more than 4 results

});