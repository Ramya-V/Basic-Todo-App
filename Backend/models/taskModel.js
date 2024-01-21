const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Task description is required']
    },
    status: {
        type: String,
        required: true,
        default: 'undone'
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timeStamp: true });

const taskModel = mongoose.model('tasks', taskSchema);

module.exports = taskModel