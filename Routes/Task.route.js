const { Router } = require("express");
const { TaskModel } = require("../Models/Task.model");
const { check, validationResult } = require("express-validator");

const { authentication } = require("../Middleware/AuthMiddleware");

const TaskRouter = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Task:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          description: Title of the task
 *        description:
 *          type: string
 *          description: Description of the task
 *        priority:
 *          type: string
 *          description: Priority of the task (e.g., low, medium, high)
 *        status:
 *          type: string
 *          description: Status of the task (e.g., pending, in-progress, completed)
 *        assignedTo:
 *          type: string
 *          description: User ID of the person to whom the task is assigned
 *        createdBy:
 *          type: string
 *          description: User ID of the task creator
 */

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

/**
 * @swagger
 * /task/create:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: New Task Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Retrieve a list of tasks
 *     tags: [Task]
 *     parameters:
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter tasks by priority
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter tasks by status
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: Filter tasks by assigned user ID
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /task/edit/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /task/delete/{id}:
 *   delete:
 *     summary: Delete an existing task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

module.exports = {
  TaskRouter,
};
