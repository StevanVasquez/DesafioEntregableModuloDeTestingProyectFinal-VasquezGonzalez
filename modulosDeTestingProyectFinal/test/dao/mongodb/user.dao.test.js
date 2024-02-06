import mongoose from "mongoose";
import { expect } from "chai";
import { MONGO_URL } from "../../../src/config/config.js";
import Users from "../../../src/dao/mongodb/user.mongo.js";
import userModel from "../../../src/models/user.model.js";

const userMockData = [
  {
    first_name: "Jose",
    last_name: "Herrera",
    email: "jooherrera4@gmail.com",
    age: 0,
    password: "123456aA$",
  },
  {
    first_name: "Estanis",
    last_name: "Varela",
    email: "estanis_89@hotmail.com",
    age: 34,
    password: "123456aA$",
  },
  {
    first_name: "Frida",
    last_name: "Varela",
    email: "fridavarelalucius@gmail.com",
    age: 27,
    password: "123456aA$",
  },
];
describe("unit test Users dao", () => {
  let userDao;
  before(async () => {
    console.log("***BEFORE***");
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  after(async () => {
    console.log("***AFTER***");
    await mongoose.connection.close();
  });
  beforeEach(() => {
    console.log("***BEFORE EACH***");
    userDao = new Users();
  });
  afterEach(() => {
    console.log("***AFTER EACH***");
    userModel
      .deleteMany({})
      .then((res) => {})
      .catch((err) => {});
  });
  describe("unit Test userDao get method", () => {
    it("should get all users successfully", (done) => {
      userDao
        .create(userMockData[0])
        .then((res) => {})
        .catch((err) => {});
      userDao
        .create(userMockData[1])
        .then((res) => {
          userDao.get().then((res) => {
            expect(res).to.have.lengthOf(2);
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  describe("unit Test userDao create method", () => {
    it("should successfully create an user with validated body.", (done) => {
      userDao
        .create(userMockData[0])
        .then((res) => {
          expect(res.first_name).to.equal(userMockData[0].first_name);
          expect(res.last_name).to.equal(userMockData[0].last_name);
          expect(res.email).to.equal(userMockData[0].email);
          expect(res.password).to.equal(userMockData[0].password);
          expect(res.first_name).to.equal(userMockData[0].first_name);
          expect(res.carts).to.deep.equal([]);
          expect(res.role).to.equal("user");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  describe("unit Test userDao getBy methods", () => {
    it("should get an existing user by email", (done) => {
      const createdUser = userDao.create(userMockData[2]).then((res) => {
        userDao
          .getUserByEmail(res.email)
          .then((res) => {
            expect(res.first_name).to.equal(userMockData[2].first_name);
            expect(res.last_name).to.equal(userMockData[2].last_name);
            expect(res.email).to.equal(userMockData[2].email);
            expect(res.carts).to.deep.equal([]);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    it("should get an existing user by id", async () => {
      const newUser = await userDao.create(userMockData[2]);
      const user = await userDao.getUserById(newUser._id);
      expect(user.first_name).to.equal(userMockData[2].first_name);
      expect(user.role).to.equal("user");
      expect(user.carts).to.deep.equal([]);
    });
  });
  describe("unit Test userDao update method", () => {
    it("should successfully update an user", async () => {
      const updatedUserPass = "1234567aA$";
      const newUser = await userDao.create(userMockData[2]);
      const user = await userDao.getUserById(newUser._id);
      await userDao.update(user.email, updatedUserPass);
      const updatedUser = await userDao.getUserById(newUser._id);
      expect(user.first_name).to.equal(userMockData[2].first_name);
      expect(user.role).to.equal("user");
      expect(user.carts).to.deep.equal([]);
      expect(updatedUser.password).to.not.equal(userMockData[2].password);
    });
  });
});