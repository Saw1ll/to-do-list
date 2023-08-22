import React from 'react';

const AddTaskForm = ({ newTask, setNewTask, addTask, tasklistId }) => {
  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      addTask(newTask); // Pass the newTask value
      setNewTask('');
    }
  };

  return (
    <>
      {/* Add Task */}
      <div className='row'>
        <div className='col'>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className='form-control form-control-lg'
          />
        </div>
        <div className='col-auto'>
          <button onClick={handleAddTask} className='btn btn-lg btn-success'>
            Add Task
          </button>
        </div>
      </div>
      <br id='endText' />
    </>
  );
};

export default AddTaskForm;
