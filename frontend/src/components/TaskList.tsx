import { useTaskStore } from "../store/taskStore";
import TaskItem from "./TaskItem";
import { useEffect } from "react";
import LoadingIcon from "./LoadingIcon";
const TaskList = () => {
  const {
    tasks,
    searchQuery,
    priorityFilter,
    statusFilter,
    fetchTasks,
    loading,
  } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "done" && task.status === "done") ||
      (statusFilter === "not done" && task.status === "not done");

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-2 max-h-1/2 overflow-auto bg-gray-100 p-4 rounded-lg mb-4">
      <h2 className="text-l font-bold mb-3">Task List</h2>
      {loading ? (
        <LoadingIcon size={50} />
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-500">No tasks match the criteria.</p>
      ) : (
        filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TaskList;
