const { Router } = require("express");
const { TaskModel } = require("../Models/Task.model");
const { check, validationResult } = require("express-validator");

const { authentication } = require("../Middleware/AuthMiddleware");

const TaskRouter = Router();

// 1. Create Task
TaskRouter.post(
  "/create",
  authentication,
  [
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, priority, status, assignedTo } = req.body;
      const newTask = new TaskModel({
        title,
        description,
        priority,
        status,
        assignedTo,
        createdBy: req.user.userId,
      });
      const saveTask = await newTask.save();
      res.status(201).send({ msg: "New Task Created", saveTask });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

// 2. Retrive Task
TaskRouter.get("/", authentication, async (req, res) => {
  try {
    const { priority, status, assignedTo } = req.query;
    let filter = { createdBy: req.user.userId };
    if (priority) {
      filter.priority = priority;
    }
    if (status) {
      filter.status = status;
    }
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }
    const tasks = await TaskModel.find(filter);
    res.status(200).send(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// 3. Update Task
TaskRouter.put("/edit/:id", authentication, async (req, res) => {
  try {
    const updateTask = await TaskModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).send({ msg: "Update Successfully", updateTask });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// 4. Delete Task
TaskRouter.delete("/delete/:id", authentication, async (req, res) => {
  try {
    const deleteTask = await TaskModel.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "Delete Successfully", deleteTask });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = {
  TaskRouter,
};
