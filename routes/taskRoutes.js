const express= require('express');
const router = express.Router();
const taskController = require('./../controllers/taskController');
const userController= require('./../controllers/userController');

router.get('/', taskController.getAllTasks);
router.post('/',userController.protect, taskController.createTask);
router.get('/:id',userController.protect,taskController.getTaskById);
router.patch('/:id',userController.protect, taskController.updateTask);
router.delete('/:id',userController.protect,taskController.deleteTask);
module.exports=router