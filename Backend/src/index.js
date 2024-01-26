const express = require('express');
const mongoose = require('mongoose');
const taskModel = require('./models/taskModel')
require('dotenv').config();

const app = express();
const port = 8080;
let isvalid;

// Listens to the port and process the request
app.listen(port, () => { console.log(`Server is running in the port ${port}`) });
// Middleware to convert the request body into JSON format, so that we can access and process the data
app.use(express.json());
// Mongodb connection
mongoose.connect(process.env.DB_URL)
    .then(() => { console.log('DB connection is established') })
    .catch((e) => { console.log('DB connection failed') });

// Creates task in todo  
app.post('/createTask', async (req, res) => {
    try {
        isvalid = validation('create', req);
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
    }
    catch (e) {
        res.status(500).send({ error: e })
    }
})

// Gets the active tasks in todo  
app.get('/getTasks', async (req, res) => {
    try {
        let response = await taskModel.find({ isActive: true });
        res.status(200).send({ data: response || [] })
    }
    catch (e) {
        res.status(500).send({ error: e })
    }
})

// Updates the task info in todo  
app.put('/updateTask/:type', async (req, res) => {
    try {
        isvalid = validation('update', req);
        if (!isvalid.status) {
            let response = await taskModel.findByIdAndUpdate(req.body.id, req.body);
            (!response) ?
                res.status(404).send({ message: 'Task is not found' }) :
                res.status(200).send({ message: `Task updated successfully` })
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

// Validation 
const validation = (validationType, req) => {
    let response = {
        status: false,
        message: []
    }
    let errorMessage = [];
    let updateType = req.params.type;

    /* Description field validation
    Description mandatory for create and updateInfo task
    */
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

    /* Id, Status, Is Active field validation
    Id mandatory for updateInfo, updateStatus and updateRemove
    Status mandatory for updateStatus
    Is Active mandatory for updateRemove
    */
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
