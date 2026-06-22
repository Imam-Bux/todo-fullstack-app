const todo = require('../../utils/todo');
const todoService = require('./service');
const joi = require('joi');
const getTodo = (req, res) => {
    const todoList = todoService.getTodo(req, res)
    res.status(200).json(todoList)
}
let todoId = 2
const addTodo = (req, res) => {
    const todoSchema = joi.object({
        id: joi.number().optional(),
        title: joi.string().required(),
        isCompleted: joi.boolean().optional().default(false)
    })
    const payload = {
        id: todoId + 1,
        title: req.body.title,
        isCompleted: req.body.isCompleted !== undefined ? req.body.isCompleted : false
    }
    const { value, error } = todoSchema.validate(payload)
    if (error) {
        console.log(error.details[0].message)
        return res.status(400).json({
            status: "error",
            message: error.details[0].message
        })
    }
    todoId++;
    todoService.addTodo(value);
    const fullUpdatedList = todoService.getTodo();
    res.status(201).json(fullUpdatedList);
}
const deleteTodo = (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ status: "error", message: "Invalid ID parameter" });
    }
    const data = todoService.deleteTodo(id);
    res.status(200).json(data);
}
const updateTodo = (req, res) => {
    const updateTodoSchema = joi.object({
        id: joi.number().required(),
        title: joi.string().optional(),
        isCompleted: joi.boolean().optional()
    })
    const todoId = parseInt(req.params.id)
    if (isNaN(todoId)) {
        return res.status(400).json({ status: "error", message: "Invalid ID parameter" });
    }
    const payload = {
        id: todoId,
    }
    if (req.body.title !== undefined) payload.title = req.body.title;
    if (req.body.isCompleted !== undefined) payload.isCompleted = req.body.isCompleted;

    const { value, error } = updateTodoSchema.validate(payload)
    if (error && error.details[0].message) {
        return res.status(400).json({ status: "error", message: error.details[0].message });
    }
    const updatedData = todoService.updateTodo(value)
    if (updatedData === "Todo does not exist") {
        return res.status(404).json({ status: "error", message: updatedData });
    }
    const fullUpdatedList = todoService.getTodo();
    res.status(200).json(fullUpdatedList);
}
const getByID = (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ status: "error", message: "Invalid ID parameter" });
    }
    const data = todoService.getByID(id);
    if (!data || data.length === 0) {
        return res.status(404).json({ status: "error", message: "Todo does not exist" });
    }
    res.status(200).json(data[0]);
    res.send(data);
}
const clearAllTodos = (req, res) => {
    const data = todoService.deleteTodo(); 
    res.status(200).json(data); 
}

module.exports = { getTodo, addTodo, deleteTodo, updateTodo, getByID, clearAllTodos }

