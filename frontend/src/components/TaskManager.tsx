import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import TaskFilters from "./TaskFilter";

const TaskManager = () => {
  return (
    <div className="p-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      <TaskFilters />
      <TaskForm />
      <TaskList />
    </div>
  );
};

export default TaskManager;
