import request from "supertest";
import app from "@index";
import { expect } from "chai";
import { User } from '@models/user';
import bcrypt from "bcrypt";

describe("Auth", async () => {

  it("Create new user", (done) => {

    const user: User = {
        id: "undefined",
        email: "test@test.co.uk",
        name: "Test",
        surname: "User",
        password: "password",
        username: "test"
    }

    request(app).post(`/auth/register`)
      .send({
        email: user.email,
        name: user.name,
        surname: user.surname,
        password: user.password,
        username: user.username
      }).end(async (error, response) => {

        const passwordMatches: boolean = await bcrypt.compare(user.password, response.body.user.password);
          
        expect(response.status).to.eql(201);
        expect(response.body.user.email).to.be.eql(user.email);
        expect(response.body.user.name).to.be.eql(user.name);
        expect(response.body.user.surname).to.be.eql(user.surname);
        expect(passwordMatches).to.be.eql(true);
        expect(response.body.user.username).to.be.eql(user.username);

        done(error);

      });

  });

  it("Don't create new user with invalid email address", (done) => {

    const user: User = {
      id: "undefined",
      email: "testtest.co.uk",
      name: "Test",
      surname: "User",
      password: "password",
      username: "test"
    }

    request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      password: user.password,
      username: user.username
    }).end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Email is invalid")
        done(error);
      });

  });

  it("Don't create new user with missing email address", (done) => {

    const user: User = {
      id: "undefined",
      email: "undefined",
      name: "Test",
      surname: "User",
      password: "password",
      username: "test"
    }

    request(app).post(`/auth/register`)
    .send({
      name: user.name,
      surname: user.surname,
      password: user.password,
      username: user.username
    }).end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Email is missing")
        done(error);
      });

  });

  it("Don't create new user with missing name", (done) => {

    const user: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "undefined",
      surname: "User",
      password: "password",
      username: "test"
    }

    request(app).post(`/auth/register`)
    .send({
      email: user.email,
      surname: user.surname,
      password: user.password,
      username: user.username
    }).end((error, response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Name is missing");
        done(error);
      });

  });

  it("Don't create new user with missing surname", (done) => {

    const user: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "Test",
      surname: "undefined",
      password: "password",
      username: "test"
  }

  request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      password: user.password,
      username: user.username
    }).end((error, response) => {

      expect(response.status).to.eql(400);
      expect(response.body.error).to.eql("Surname is missing");
      done(error);

    });

  });

  it("Don't create new user with missing password", (done) => {

    const user: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "Test",
      surname: "User",
      password: "undefined",
      username: "test"
  }

  request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      username: user.username
    }).end((error, response) => {

      expect(response.status).to.eql(400);
      expect(response.body.error).to.eql("Password is missing");
      done(error);

    });
  });

  it("Don't create new user with missing username", (done) => {

    const user: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "Test",
      surname: "User",
      password: "password",
      username: "undefined"
  }

  request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      password: user.password
    }).end((error, response) => {

      expect(response.status).to.eql(400);
      expect(response.body.error).to.eql("Username is missing");
      done(error);

    });

  });

  it("Don't create new user with duplicate email address", (done) => {

    const user: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "Test",
      surname: "User",
      password: "password",
      username: "new username"
    }

    request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      password: user.password,
      username: user.username
    }).end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body.error).to.eql("Email is already taken");
        done(error);
      });

  });

  it("Don't create new user with duplicate username", (done) => {

    const user: User = {
      id: "undefined",
      email: "newemail@test.co.uk",
      name: "Test",
      surname: "User",
      password: "password",
      username: "test"
    }

    request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      password: user.password,
      username: user.username
    }).end((error, response) => {
        expect(response.status).to.eql(200);
        expect(response.body.error).to.eql("Username is already taken");
        done(error);
      });

  });

// wipe db after this

});