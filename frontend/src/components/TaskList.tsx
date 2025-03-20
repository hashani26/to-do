import { useTaskStore } from "../store/taskStore";
import TaskItem from "./TaskItem";
import { useEffect } from "react";

const TaskList = () => {
  const { tasks, searchQuery, priorityFilter, statusFilter, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
    const matchesStatus = 
      statusFilter === "All" ||
      (statusFilter === "done" && task.status === 'done') ||
      (statusFilter === "not done" && task.status === 'not done');

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-2 max-h-1/2 overflow-auto">
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500">No tasks match the criteria.</p>
      ) : (
        filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TaskList;
