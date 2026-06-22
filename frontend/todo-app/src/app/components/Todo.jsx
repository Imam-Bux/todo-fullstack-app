"use client";
import React, { useState, useEffect } from 'react';
import { FaBolt, FaPlus, FaPen, FaCheck, FaCheckDouble, FaTrash, FaHeart } from 'react-icons/fa';
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/todo";
import axios from 'axios';
export default function Todo() {
  const [tasks, setTasks] = useState("");
  const [todo, setTodo] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  async function fetchTasks() {
    try {
      const response = await axios.get(API_URL);
      setTodo(response.data);
    }
    catch (error) {
      console.error("Error fetching tasks from backend:", error);
    }
  }
  useEffect(() => {
    fetchTasks();
  }, []);

  function onInput(e) {
    setTasks(e.target.value);
  }

  async function addTask() {
    if (tasks.trim() === "") {
  alert("Task cannot be empty! Please type something.");
  return;
}
    if (isEditing) {
      try {
        const response = await axios.put(`${API_URL}/${editId}`, {
          title: tasks
        });
        if (response.status === 200 || response.status === 204) {
          setTodo(response.data);
          setIsEditing(false);
          setEditId(null);
        }
      }
      catch (error) {
        console.error("Error updating task:", error);
      }
    }
    else {
      try {
        const response = await axios.post(API_URL, {
          title: tasks,
          isCompleted: false
        });
        if (response.status === 200 || response.status === 201) {
          setTodo(response.data);
        }
      }
      catch (error) {
        console.error("Error creating task:", error);
      }
    }
    setTasks("");
  }

  async function deleteTask(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`)
      if (response.status === 200 || response.status === 204) {
        setTodo(response.data)
      }
      if (isEditing && editId === id) {
        setIsEditing(false);
        setEditId(null);
        setTasks("");
      }
    }
    catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  async function completeTask(id) {
    const taskToToggle = todo.find(item => item.id === id)
    if (!taskToToggle) return;
    try {
      const response = await axios.put(`${API_URL}/${id}`,
        {
          isCompleted: !taskToToggle.isCompleted
        })
      if (response.status === 200 || response.status === 204) {
        setTodo(response.data);
      }
    }
    catch (error) {
      console.error("Error toggling status:", error);
    }
  }
  function startEdit(item) {
    setTasks(item.title);
    setIsEditing(true);
    setEditId(item.id);
  }

  async function clearAll() {
    if (todo.length > 0) {
      if (window.confirm("Are you sure you want to clear all tasks from the database?")) {
        try {
          const response = await axios.delete(API_URL);
          if (response.status === 200 || response.status === 204) {
            setTodo(response.data);
            setIsEditing(false);
            setEditId(null);
            setTasks("");
          }
        }
        catch (error) {
          console.error("Error clearing database contents:", error);
        }
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-primary flex items-center justify-center p-4">
  <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md border border-gray-100 font-sans">
    <h1 className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-2 mb-1">
      <FaBolt className="text-blue-600 animate-bounce" />
      Task Pro
    </h1>
    <div className="text-center mb-6">
      <p className="text-sm text-gray-400">Connected via Axios</p>
    </div>

    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={tasks}
        onChange={onInput}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
      />
      <button onClick={addTask} className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg transition-colors flex items-center justify-center font-semibold shadow-sm">
        {isEditing ? <FaPen size={14} /> : <FaPlus size={14} />}
      </button>
    </div>

    <ul className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1">
      {todo.map((item) => (
        <li key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all group">
          <span className={`text-gray-700 font-medium transition-all duration-200 ${item.isCompleted ? 'line-through text-gray-400 italic' : ''}`}>
            {item.title}
          </span>
          <div className="flex items-center gap-3 text-gray-400">
            <button onClick={() => completeTask(item.id)} className="hover:scale-110 transition-transform focus:outline-none">
              {item.isCompleted ? <FaCheckDouble className="text-green-500" size={16} /> : <FaCheck className="hover:text-green-500" size={16} />}
            </button>
            <button onClick={() => startEdit(item)} className="hover:text-blue-500 hover:scale-110 transition-all focus:outline-none">
              <FaPen size={14} />
            </button>
            <button onClick={() => deleteTask(item.id)} className="hover:text-red-500 hover:scale-110 transition-all focus:outline-none">
              <FaTrash size={14} />
            </button>
          </div>
        </li>
      ))}
    </ul>

    <hr className="border-gray-100 mb-4" />

    <div className="flex items-center justify-between mb-6">
      <small className="text-xs text-gray-400 font-medium">{todo.length} task{todo.length !== 1 ? 's' : ''} total</small>
      <button className="text-xs font-semibold text-red-400 hover:text-red-500 transition-colors focus:outline-none" onClick={clearAll}>Clear All</button>
    </div>

    <footer className="flex flex-col items-center justify-center gap-1 text-[11px] text-gray-600 border-t border-gray-50 pt-4">
      <span className="flex items-center gap-1">Made by Imam with <FaHeart className="text-red-400 animate-bounce" size={10} /></span>
      <span>&copy;2025 All rights reserved</span>
    </footer>
  </div></div>
  );
}