const UpdateForm = ({ updateData, changeTask, updateTask, cancelUpdate }) => {
  const handleChangeTask = (e) => {
    console.log(e.target.value);
    changeTask(e.target.value);
  };
  

  return (
    <>
      {/* Update Task */}
      <div className="row">
        <div className="col">
          <input
            value={updateData && updateData.title}
            onChange={handleChangeTask}
            className="form-control form-control-lg"
          />
        </div>
        <div className="col-auto">
          <button onClick={updateTask} className="btn btn-lg btn-success mr-20">
            Update
          </button>
          <button onClick={cancelUpdate} className="btn btn-lg btn-warning">
            Cancel
          </button>
        </div>
      </div>
      <br id="endText" />
    </>
  );
};

export default UpdateForm;
