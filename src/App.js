import axios from 'axios';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';


import AddTaskForm from './comps/AddTaskForms.jsx';
import ToDo from './comps/ToDo.jsx';
import UpdateForm from './comps/UpdateForms.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  // Retrieve saved to-do-list from local storage, or use an empty array if none exists
  const savedValues = JSON.parse(localStorage.getItem('to-do-list-storage')) || [];

  // Tasks (ToDo List) State
  const [toDo, setToDo] = useState(savedValues);

  // Temp State
  const [newTask, setNewTask] = useState('');
  const [updateData, setUpdateData] = useState('');
  const [tasklistId, setTaskListId] = useState(1);

  useEffect(() => {
    // Make a request for a user with a given ID
    axios
      .get('http://localhost:3000/api/tasks')
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/tasks')
      .then(function (response) {
        setToDo(response.data);
      })
      .catch(function (error) {
        console.error('Error fetching tasks:', error);
      });
    axios
      .get('http://localhost:3000/api/tasklistid')
      .then(function (response) {
        setTaskListId(response.data);
      })
      .catch(function (error) {
        console.error('Error fetching task list ID:', error);
      });
  }, []);

  const addTask = () => {
    if (newTask) {
      const newEntry = {
        id: toDo.length + 1,
        title: newTask,
        status: false,
      };
      // Update state with the new task
      setToDo([...toDo, newEntry]);
      setNewTask('');

      // Insert new task into MySQL
      axios
        .post('http://localhost:3000/api/tasks', {
          tasklist_id: tasklistId,
          status: false,
          ttl_of_task: newTask,
          date_created: new Date().toISOString().split('T')[0]
        })
        .then(function (response) {
          console.log('Task inserted into MySQL database:', response.data);
        })
        .catch(function (error) {
          console.error('Error inserting task into MySQL:', error);
        });
    }
  };

  // Delete task
  const deleteTask = (id) => {
    let newTasks = toDo.filter((task) => task.id !== id);
    setToDo(newTasks);
  };

  // Mark task as done or complete
  const markDone = (id) => {
    const newTask = toDo.map((task) => {
      if (task.id === id) {
        return { ...task, status: !task.status };
      }
      return task;
    });
    setToDo(newTask);
  };

  // Cancel update
  const cancelUpdate = () => {
    setUpdateData('');
  };

  // Change task for update
  const changeTask = (value) => {
    let newEntry = {
      tasklistId: tasklistId,
      id: updateData.id,
      title: value,
      status: updateData.status ? true : false,
    };
    setUpdateData(newEntry);
  };

  // Update task
  const updateTask = () => {
    if (updateData && updateData.id) {
      axios
        .put(`http://localhost:3000/api/tasks/${updateData.id}`, {
          tasklist_id: updateData.tasklistId,
          status: updateData.status ? 1 : 0,
          ttl_of_task: updateData.title,
          date_created: new Date().toISOString().split('T')[0],
        })
        .then(function (response) {
          console.log('Task updated in MySQL database:', response.data);
          setUpdateData('');
        })
        .catch(function (error) {
          console.error('Error updating task in MySQL:', error);
        });
    }
  };

  return (
    <div className="container App">
      <Helmet>
        <title>To-Do-List by Sawill</title>
      </Helmet>
      <br id="endText" />
      <h2>To Do List (in React.js)</h2>
      <br id="endText" />

      {/* Update Task */}
      {updateData && updateData.id ? (
        <UpdateForm
          updateData={updateData}
          changeTask={changeTask}
          updateTask={updateTask}
          cancelUpdate={cancelUpdate}
        />
      ) : (
        /* Add Task */
        <AddTaskForm
          newTask={newTask}
          setNewTask={setNewTask}
          addTask={addTask}
          tasklistId={tasklistId}
        />
      )}

      {/* Display ToDos */}
      {toDo && toDo.length ? '' : 'No Tasks...'}
      <ToDo toDo={toDo} markDone={markDone} setUpdateData={setUpdateData} deleteTask={deleteTask} />

      <br id="endText" />
      <br />
      <div id="endText">Made with help from a YouTube video.</div>
    </div>
  );
}

export default App;
