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
            await taskDetails.save();
            res.status(200).send({ message: 'Task created successfully' })

        }
        else {
            res.status(400).send({ error: isvalid.message })
        }
    } catch (e) {
        res.status(500).send({ error: e })

    }
})

app.get('/getTasks', async (req, res) => {
    try {
        let response = await taskModel.find({});
        res.status(200).send({ data: response || [] })
    } catch (e) {
        res.status(500).send({ error: e })
    }
})

app.put('/updateTask/:type', async (req, res) => {
    try {
        console.log(req.body, req.params);
        isvalid = validation('update', req);
        console.log(isvalid)
        if (!isvalid.status) {
            let response = await taskModel.findByIdAndUpdate(req.body.id, req.body);
            (!response) ?
                res.status(404).send({ message: 'Task is not found' }) :
                res.status(200).send({ message: 'Task updated successfully' })
        }
        else {
            res.status(400).send({ error: isvalid.message })
        }
    } 
    catch (e) {
        console.log(e)
        res.status(500).send({ error: e })

    }
})

const validation = (validationType, req) => {
    let response = {
        status: false,
        message: []
    }
    let errorMessage = [];
    if (validationType == 'update') {
        let { type } = req.params;
        console.log(req.params)
        if (type == 'info' || 'status') {
            if (!req.body.id) {
                errorMessage.push('Id is a required field')
                response = {
                    status: true,
                    message: errorMessage
                }
            }
        }
        if (type == 'status') {
            if (!req.body.status) {
                errorMessage.push('Status is a required field')
                response = {
                    status: true,
                    message: errorMessage
                }
            }
            else {
                console.log("test")
                if (typeof req.body.status == 'number') {
                    errorMessage.push('Status is a string type')
                    response = {
                        status: true,
                        message: errorMessage
                    }
                }
            }
        }

    }
    if (validationType == 'create' || 'update') {
        if (!req.body.description) {
            errorMessage.push('Description is a required field')
            response = {
                status: true,
                message: errorMessage
            }
        }
        else {
            if (typeof req.body.description == 'number') {
                errorMessage.push('Description is a string type')
                response = {
                    status: true,
                    message: errorMessage
                }
            }
        }
    }
    return response
}
