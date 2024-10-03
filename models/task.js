const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true,
        trim:true
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:['pending','in-progress','completed'],
        required : true,
        default:'pending'
    },
    dueDate:{
        type:Date
    }
})

module.exports = mongoose.model('Task', TaskSchema);