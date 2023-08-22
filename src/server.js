const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'to-do-list-database'
});

// Connect to the MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});



// Get all tasks
app.get('/api/tasks', (req, response) => {
  connection.query(`SELECT * FROM tasks WHERE tasklist_id = ?`, [req.id], (err, res, fields) => {
    console.log(err, res, fields);
    response.json(res);
  });
});

// Add task
app.post('/api/tasks', (req, res) => {
  const { tasklist_id, status, ttl_of_task, date_created } = req.body;
  if (tasklist_id && status !== undefined && ttl_of_task && date_created) {
    const newTask = {
      tasklist_id,
      status,
      ttl_of_task,
      date_created,
    };

    // Insert new task into MySQL
    const insertQuery = 'INSERT INTO tasks (tasklist_id, status, ttl_of_task, date_created) VALUES (?, ?, ?, ?)';
    connection.query(insertQuery, [newTask.tasklist_id, newTask.status, newTask.ttl_of_task, newTask.date_created], (err, result) => {
      if (err) {
        console.error('Error inserting task into MySQL:', err);
        res.status(500).json({ error: 'Failed to add task.' });
      } else {
        console.log('Task inserted into MySQL database.');
        res.json({ success: true });
      }
    });
  } else {
    res.status(400).json({ error: 'Required fields are missing or invalid.' });
  }
});

// Delete task
app.delete('/api/tasks/', (req, res) => {
  const taskId = req.params.id;

  // Delete task from MySQL 
  const deleteQuery = 'DELETE FROM tasks WHERE id = ?';
  connection.query(deleteQuery, [taskId], (err, result) => {
    if (err) {
      console.error('Error deleting task from MySQL:', err);
      res.status(500).json({ error: 'Failed to delete task.' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Task not found.' });
    } else {
      console.log('Task deleted from MySQL database.');
      res.json({ success: true });
    }
  });
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { tasklist_id, status, ttl_of_task, date_created } = req.body;

  if (tasklist_id && status && ttl_of_task && date_created) {
    const updateQuery = 'UPDATE tasks SET tasklist_id = ?, status = ?, ttl_of_task = ?, date_created = ? WHERE id = ?';
    connection.query(updateQuery, [tasklist_id, status, ttl_of_task, date_created, taskId], (err, result) => {
      if (err) {
        console.error('Error updating task in MySQL:', err);
        res.status(500).json({ error: 'Failed to update task.' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Task not found.' });
      } else {
        console.log('Task updated in MySQL database.');
        res.json({ success: true });
      }
    });
  } else {
    res.status(400).json({ error: 'Required fields are missing.' });
  }
});


// Serve static files
app.use(express.static(path.join(__dirname, 'to-do-list', 'build')));

// Catch-all route for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'to-do-list', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});