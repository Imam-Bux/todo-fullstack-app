const express=require('express');
const router=express.Router();
const todoController=require('./controller');
router.get('/',todoController.getTodo)
router.post('/',todoController.addTodo)
router.delete('/:id', todoController.deleteTodo)
router.delete('/', todoController.clearAllTodos)
router.put('/:id',todoController.updateTodo)
router.get('/:id',todoController.getByID)
module.exports=router;
