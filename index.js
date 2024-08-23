const express = require("express");
const cors = require("cors");
const { connection } = require("./Connection/Connection");
const { UserRouter } = require("./Routes/User.route");
const { TaskRouter } = require("./Routes/Task.route");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Welcome to Task Management System with Secure Auth");
});

app.use("/user", UserRouter);
app.use("/task", TaskRouter);

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }
  console.log(`Server Running on PORT ${port}`);
});
