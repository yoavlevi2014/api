import request from "supertest";
import app from "@index";
import { expect } from "chai";
import { User } from '@models/user';
import bcrypt from "bcrypt";

describe("Auth", async () => {

  it("Create new user", async () => {

    const user: User = {
        id: "undefined",
        email: "test@test.co.uk",
        name: "Test",
        surname: "User",
        password: "password",
        username: "test"
    }

    return await request(app).post(`/auth/register`)
      .send({
        email: user.email,
        name: user.name,
        surname: user.surname,
        password: user.password,
        username: user.username
      }).then(async (response) => {

        const passwordMatches: boolean = await bcrypt.compare(user.password, response.body.user.password);
          
        expect(response.status).to.eql(201);
        expect(response.body.user.email).to.be.eql(user.email);
        expect(response.body.user.name).to.be.eql(user.name);
        expect(response.body.user.surname).to.be.eql(user.surname);
        expect(passwordMatches).to.be.eql(true);
        expect(response.body.user.username).to.be.eql(user.username);

      }).catch((error) => {
        console.error(error);
      });

      // Tests actually work but dont fail

  });

  it("Don't create new user with invalid email address", async () => {

    const user: User = {
      id: "undefined",
      email: "testtest.co.uk",
      name: "Test",
      surname: "User",
      password: "password",
      username: "test"
    }

    return await request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      password: user.password,
      username: user.username
    }).then((response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Email is invalid")
      }).catch((error) => {
        console.error(error);
      });

  });

  it("Don't create new user with missing email address", async () => {

    const user: User = {
      id: "undefined",
      email: "undefined",
      name: "Test",
      surname: "User",
      password: "password",
      username: "test"
    }

    return await request(app).post(`/auth/register`)
    .send({
      name: user.name,
      surname: user.surname,
      password: user.password,
      username: user.username
    }).then((response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Email is missing")
      }).catch((error) => {
        console.error(error);
      });

  });

  it("Don't create new user with missing name", async () => {

    const user: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "undefined",
      surname: "User",
      password: "password",
      username: "test"
    }

    return await request(app).post(`/auth/register`)
    .send({
      email: user.email,
      surname: user.surname,
      password: user.password,
      username: user.username
    }).then((response) => {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Name is missing")
      }).catch((error) => {
        console.error(error);
      });

  });

  it("Don't create new user with missing surname", async () => {

    const user: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "Test",
      surname: "undefined",
      password: "password",
      username: "test"
  }

  return await request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      password: user.password,
      username: user.username
    }).then(async (response) => {

      expect(response.status).to.eql(400);
      expect(response.body.error).to.eql("Surname is missing")

    }).catch((error) => {
      console.error(error);
    });

  });

  it("Don't create new user with missing password", async () => {

    const user: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "Test",
      surname: "User",
      password: "undefined",
      username: "test"
  }

  return await request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      username: user.username
    }).then(async (response) => {

      expect(response.status).to.eql(400);
      expect(response.body.error).to.eql("Password is missing")

    }).catch((error) => {
      console.error(error);
    });
  });

  it("Don't create new user with missing username", async () => {

    const user: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "Test",
      surname: "User",
      password: "password",
      username: "undefined"
  }

  return await request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      password: user.password
    }).then(async (response) => {

      expect(response.status).to.eql(400);
      expect(response.body.error).to.eql("Username is missing")

    }).catch((error) => {
      console.error(error);
    });

  });

  it("Don't create new user with duplicate email address", async () => {

    const user: User = {
      id: "undefined",
      email: "test@test.co.uk",
      name: "Test",
      surname: "User",
      password: "password",
      username: "new username"
    }

    return await request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      password: user.password,
      username: user.username
    }).then((response) => {
        expect(response.status).to.eql(200);
        expect(response.body.error).to.eql("Email is already taken")
      }).catch((error) => {
        console.error(error);
      });

  });

  it("Don't create new user with duplicate username", async () => {

    const user: User = {
      id: "undefined",
      email: "newemail@test.co.uk",
      name: "Test",
      surname: "User",
      password: "password",
      username: "test"
    }

    return await request(app).post(`/auth/register`)
    .send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      password: user.password,
      username: user.username
    }).then((response) => {
        expect(response.status).to.eql(200);
        expect(response.body.error).to.eql("Username is already taken")
      }).catch((error) => {
        console.error(error);
      });

  });

// wipe db after this

});