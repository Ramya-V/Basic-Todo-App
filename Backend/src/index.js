const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bcrypt = require('bcrypt');
const taskModel = require("./models/taskModel");
const userModel = require('./models/userModel');
const validation = require("./validator/validator");
require("dotenv").config();

const app = express();
const port = 8080;
const saltRounds = 10;

// Listens to the port and process the request
app.listen(port, () => { console.log(`Server is running in the port ${port}`); });
// Middleware to convert the request body into JSON format, so that we can access and process the data
app.use(express.json());
// Enable CORS for all routes
app.use(cors());
// Mongodb connection
mongoose.connect(process.env.DB_URL)
  .then(() => { console.log("DB connection is established"); })
  .catch((e) => { console.log("DB connection failed"); });

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
    res.status(500).send({ error: e });
  }
});

// Create user while sign up
app.post("/signup", async (req, res) => {
  try {
    let valid = validation("user", req.body);
    if (!valid?.errors) {
      let encryptPassword = await bcrypt.hash(req.body.password, saltRounds);
      let email = (req.body.email).toLowerCase();
      let userDetails = new userModel({
        userName: req.body.userName,
        email: email,
        password: encryptPassword
      })
      let isUserExist = await userModel.findOne({ email: email });
      if (isUserExist != null) {
        return res.status(400).send({ error: "User already exists, please signup with different email" });
      }
      let response = await userDetails.save();
      res.status(200).send({ message: `User created successfully` });
    } else {
      res.status(400).send({ error: valid.errors });
    }
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

// Login user
app.post("/login", async (req, res) => {
  try {
    let valid = validation("auth", req.body);
    if (!valid?.errors) {
      let email = (req.body.email).toLowerCase();
      let isUserExist = await userModel.findOne({ email: email });
      console.log("isUserExist", isUserExist)
      if (isUserExist == null) {
        return res.status(404).send({ error: "User not found, please signup to create an account" });
      }

      let login = await bcrypt.compare(req.body.password, isUserExist.password);
      login ?
        res.status(200).send({ message: `User logged in successfully` }) :
        res.status(400).send({ message: `Password is incorrect` })
    } else {
      res.status(400).send({ error: valid.errors });
    }
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

