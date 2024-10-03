const express= require('express');
const Task = require('../models/task');

exports.getAllTasks = async(req,res)=>{
    
    const task = await Task.find();
    res.status(200).json({
        status:"success",
        data: task
    })
}

exports.createTask = async(req,res)=>{
    try{
        const task = new Task(req.body);
        await task.save();
        res.status(201).json({
            status:"created",
            data:task
        })
    }
    catch(err){
        res.status(404).json({
            message:"You are not logged in"
        })
    }
}

exports.getTaskById = async(req,res)=>{
    const task = await Task.findById(req.params.id);
    res.status(200).json({
        status:"success",
        data: task
    })
}

exports.updateTask = async(req,res)=>{
    const task = await Task.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        status:"sucessfuly updated",
        data:task
    })
}

exports.deleteTask = async(req,res)=>{
    const task = await Task.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status:"deleted",
        data:"task"
    });
}
