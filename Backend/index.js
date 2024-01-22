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
        let response = await taskModel.find({ isActive: true });
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

app.put('/removeTask', async (req, res) => {
    try {
        isvalid = validation('remove', req);
        console.log(isvalid)
        if (!isvalid.status) {
            let response = await taskModel.findByIdAndUpdate(req.body.id, req.body);
            (!response) ?
                res.status(404).send({ message: 'Task is not found' }) :
                res.status(200).send({ message: 'Task removed successfully' })
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
    let updateType = req.params.type
    if (validationType == 'create' || (validationType == 'update' && updateType == 'info')) {
        if (!req.body.description) {
            errorMessage.push('Description is a required field')
            response = {
                status: true,
                message: errorMessage
            }
        }
        else {
            if (typeof req.body.description != 'string') {
                errorMessage.push('Description is a string type')
                response = {
                    status: true,
                    message: errorMessage
                }
            }
        }
    }
    if (validationType == 'update' || 'remove') {

        if (!req.body.id) {
            errorMessage.push('Id is a required field')
            response = {
                status: true,
                message: errorMessage
            }
        }
        if (updateType == 'status') {
            if (!req.body.status) {
                errorMessage.push('Status is a required field')
                response = {
                    status: true,
                    message: errorMessage
                }
            }
            else {
                if (typeof req.body.status != 'string') {
                    errorMessage.push('Status is a string type')
                    response = {
                        status: true,
                        message: errorMessage
                    }
                }
            }
        }
        if (updateType == 'remove') {
            console.log(req.body.isActive)
            if (req.body.isActive == (null || undefined)) {
                errorMessage.push('isActive is a required field')
                response = {
                    status: true,
                    message: errorMessage
                }
            }
            else {
                if (typeof req.body.isActive != 'boolean') {
                    errorMessage.push('isActive is a boolean type')
                    response = {
                        status: true,
                        message: errorMessage
                    }
                }
            }
        }

    }

    return response
}
