const server = require("./server");
const mongoose = require("mongoose");
const { PORT } = process.env;
const list = require("express-list-endpoints");

mongoose
  .connect(process.env.MONGO_URI + "/jest-lesson", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    server.listen(PORT, () => {
      console.log(list(server));
      console.log("Server listening on port " + PORT);
    })
  );
