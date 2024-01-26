const express = require("express");
const mongoose = require("mongoose");
const taskModel = require("./models/taskModel");
const validation = require("./validator/taskValidator");
require("dotenv").config();

const app = express();
const port = 8080;

// Listens to the port and process the request
app.listen(port, () => {console.log(`Server is running in the port ${port}`);});
// Middleware to convert the request body into JSON format, so that we can access and process the data
app.use(express.json());
// Mongodb connection
mongoose.connect(process.env.DB_URL)
  .then(() => {console.log("DB connection is established");})
  .catch((e) => {console.log("DB connection failed");});

// Creates task in todo
app.post("/createTask", async (req, res) => {
  try {
    let valid = validation("create", req.body);
    if (!valid?.errors) {
      let taskDetails = new taskModel({
        description: req.body.description,
      });
      await taskDetails.save();
      res.status(200).send({ message: "Task created successfully" });
    } else {
      res.status(400).send({ error: valid.errors });
    }
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

// Gets the active tasks in todo
app.get("/getTasks", async (req, res) => {
  try {
    let response = await taskModel.find({ isActive: true });
    res.status(200).send({ data: response || [] });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

// Updates the task info in todo
app.put("/updateTask/:type", async (req, res) => {
  try {
    let valid = validation(req.params.type, req.body);
    if (!valid?.errors) {
      let response = await taskModel.findByIdAndUpdate(req.body.id, req.body);
      !response
        ? res.status(404).send({ message: "Task is not found" })
        : res.status(200).send({ message: `Task updated successfully` });
    } else {
      res.status(400).send({ error: valid.errors });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
});
