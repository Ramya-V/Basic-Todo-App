const express = require('express');
const mongoose = require('mongoose');
const taskModel = require('./models/taskModel')
require('dotenv').config();

const app = express();
const port = 8080;

app.listen(port, () => { console.log(`Server is running in the port ${port}`) });
app.use(express.json());

mongoose.connect(process.env.DB_URL)
    .then(() => { console.log('DB connection is established') })
    .catch((e) => { console.log('DB connection failed') });

let isvalid = '';

app.post('/createTask', async (req, res) => {
    try {
        console.log(req.body)
        isvalid = validation('create', req);
        console.log(isvalid)
        if (!isvalid.status) {
            let taskDetails = new taskModel({
                description: req.body.description
            })
            taskDetails.save();
            res.status(200).send({ message: 'Task created successfully' })

        }
        else {
            res.status(400).send({ error: isvalid.message })
        }
    } catch (e) {
        res.status(500).send({ error: e })

    }
})

const validation = (type, req) => {
    let response = {
        status: false,
        message: ''
    }
    if (type == 'create') {
        if (!req.body.description) {
            response.status = true;
            response.message = 'Description is a required field';
        }
        else {
            if (typeof req.body.description == 'number') {
                response.status = true;
                response.message = 'Description is a string type';
            }
        }
    }
    return response
}
