const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Welcome to Task Management System with Secure Authentication",
      version: "1.0.0",
    },
  },
  apis: ["./Routes/*.js"],
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

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
