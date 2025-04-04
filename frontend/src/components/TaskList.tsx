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
    sort,
  } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  function renderTasks() {
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

    if (sort !== "All") {
      const priorityOrder = { Low: 1, Medium: 2, High: 3 };
      const statusOrder = { done: 1, "not done": 2 };

      const sortedTasks = [...filteredTasks].sort((a, b): number => {
        if (sort === "pAsc") {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (sort === "pDsc") {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        } else if (sort === "sAsc") {
          return statusOrder[a.status] - statusOrder[b.status];
        } else if (sort === "sDsc") {
          return statusOrder[b.status] - statusOrder[a.status];
        }
        return 1;
      });
      return sortedTasks;
    } else {
      return filteredTasks;
    }
  }

  return (
    <div className="space-y-2 max-h-1/2 overflow-auto bg-gray-100 p-4 rounded-lg mb-4">
      <h2 className="text-l font-bold mb-3">Task List</h2>
      {loading ? (
        <LoadingIcon size={50} />
      ) : renderTasks().length === 0 ? (
        <p className="text-gray-500">No tasks match the criteria.</p>
      ) : (
        renderTasks().map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TaskList;
