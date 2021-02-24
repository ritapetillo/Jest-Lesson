const server = require("../src/server");
const request = require("supertest")(server);
const mongoose = require("mongoose");
const UserSchema = require("../src/services/users/schema");
const User = require("mongoose").model("User", UserSchema);

beforeAll((done) => {
  mongoose
    .connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("Successfully connected to Atlas.");
      done();
    });
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe("Stage I, testing login route", () => {
  it("Should return 401 if credentilas are wrong", async () => {
    const user = {
      username: "rita",
      password: "blabla",
    };
    const newUser = new User(user);
    newUser.save();
    const response = await request
      .post("/users/login")
      .send({ username: "rit", password: "bbb" })
      .expect(401);
  });
});
