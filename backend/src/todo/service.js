let todoList = require('../../utils/todo');
let helperfunctions = require('./../../utils/helper')
const getTodo = (req, res) => {
    return todoList
}
const getByID = (id) => {
    return todoList.filter((item) => item.id === id);
}
const addTodo = (payload) => {
    todoList.push(payload)
    return payload
}
const deleteTodo = (id) => {
    if (id === undefined) {
        todoList = [];
        return todoList;
    }
    todoList = todoList.filter((item) => {
        return item.id !== id
    })
    return todoList
}
const updateTodo = (payload) => {

    const filterPayload = helperfunctions.cleanPayload
        ? helperfunctions.cleanPayload(payload)
        : payload;
    const todo = todoList.find((v) => v.id === payload.id);

    if (!todo) {
        return "Todo does not exist"
    } else {
        const index = todoList.findIndex((v) => v.id === payload.id);
        todoList[index] = { ...todoList[index], ...filterPayload };
        return todoList[index];
    }
}

module.exports = { getTodo, addTodo, deleteTodo, updateTodo, getByID }