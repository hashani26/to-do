import { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import LoadingIcon from "./LoadingIcon";

const TaskForm = () => {
  const { addTask, tasks, loading } = useTaskStore();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [recurrence, setRecurrence] = useState<
    "Daily" | "Weekly" | "Monthly" | ""
  >("");
  const [dependency, setDependency] = useState<number | undefined>(undefined);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");

    addTask({
      title,
      priority,
      recurrence: recurrence ? recurrence : undefined,
      dependency: dependency !== undefined ? dependency : undefined,
      status: "not done",
    });
    setTitle("");
    setRecurrence("");
    setDependency(-1);
    setPriority("Low");
  };
  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg mb-4">
      <h2 className="text-l font-bold mb-3">Add Task</h2>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        maxLength={40}
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="flex gap-2 mb-2">
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "Low" | "Medium" | "High")
          }
          className="p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          value={recurrence}
          onChange={(e) =>
            setRecurrence(e.target.value as "Daily" | "Weekly" | "Monthly" | "")
          }
          className="p-2 border rounded"
        >
          <option value="">No Recurrence</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <select
          value={dependency}
          onChange={(e) =>
            setDependency(
              e.target.value === undefined ? undefined : Number(e.target.value),
            )
          }
          className="p-2 border rounded"
        >
          <option key={-1} value={-1}>
            No Dependency
          </option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        // disabled={!title}
        className="bg-black text-white px-4 py-2 rounded cursor-pointer disabled:bg-gray-700 disabled:cursor-auto w-40"
      >
        {loading ? <LoadingIcon size={30} /> : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
