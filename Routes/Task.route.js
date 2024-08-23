const { Router } = require("express");

const TaskRouter = Router();

// 1. Create Task
TaskRouter.post("/create", async (req,res) => {
  try {
    
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

// 2. Retrive Task
// 3. Update Task
// 4. Delete Task

module.exports = {
  TaskRouter,
};
