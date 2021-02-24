const server = require("../src/server");
const request = require("supertest")(server);
const mongoose = require("mongoose");
const UserSchema = require("../src/services/users/schema");
const User = require("mongoose").model("User", UserSchema);
const jwt = require("jsonwebtoken");
const user = {
  username: "ritapetillo",
  password: "pass",
};
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
    const newUser = new User(user);
    newUser.save();
    const response = await request
      .post("/users/login")
      .send({ username: "rit", password: "bbb" })
      .expect(401);
  });
});

describe("Stage II, should provide valid tokens with right credentials", () => {
  it("Should return a valid token", async () => {
    const newUser = new User(user);
    const savedUser = newUser.save();
    const response = await request.post("/users/login").send(user);
    const { token } = response.body;
    const verifiedToekn = jwt.verify(token, process.env.TOKEN_SECRET);
    expect(verifiedToekn._id).toBe(savedUser._id);
  });
});

describe("Stage III, /cat route", () => {
  it("Should return a valid token", async () => {
    const newUser = new User(user);
    const savedUser = newUser.save();
    const response = await request.post("/users/login").send(user);
    const { token } = response.body;
    const verifiedToekn = jwt.verify(token, process.env.TOKEN_SECRET);
    expect(verifiedToekn._id).toBe(savedUser._id);

    const responseCat = await request.get("/cats").set("Authorization", token);
    expect(responseCat.status).toEqual(200);
    expect(responseCat.body.url).toBeDefined();
    expect(typeof responseCat.body.url).toBe("string");
  });
});

// describe("Stage IV, /cat route",() => {
//   it("Should return a valid token", async () => {
//     const responseCat = await request.get("/cats");

//     expect(responseCat.status).toEqual(401);
//   });
// });
