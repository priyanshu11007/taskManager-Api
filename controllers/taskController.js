const express = require("express");
const Task = require("../models/task");
const { use } = require("bcrypt/promises");

exports.getAllTasks = async (req, res) => {
    try {
        const userID = req.user._id;
        const tasks = await Task.find({ user: userID });
        if(tasks.length == 0){
            res.status(401).json({
                message:"No tasks available"
            })
        }
        res.status(200).json({
          status: "success",
          data: {
            tasks,
          },
        });
      } catch (err) {
        res.status(500).json({
          message: "Something bad occured, Try again",
        });
      }
};

exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user._id,
    });
    await task.save();
    res.status(201).json({
      status: "created",
      data: task,
    });
  } catch (err) {
    res.status(404).json({
      message: "Error occured while creating task,Try again",
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const userIdString = task.user.toString();
    if (userIdString != req.user._id) {
      res.status(401).json({
        status: "not authorized",
      });
    }
    res.status(200).json({
      status: "success",
      data: task,
    });
  } catch (err) {
    res.status(404).json({
      message: "Something bad happend, try again",
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to update this task",
      });
    }
    await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "sucessfuly updated",
      data: task,
    });
  } catch (err) {
    res.status(404).json({
      message: "Something bad happend, try again",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to delete this task",
      });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "deleted",
      data: "task",
    });
  } catch (err) {
    res.status(404).json({
      message: "Error occured while deleting",
    });
  }
};
