import { create } from "zustand";

//move to a single file to access both fe and be
export type Task = {
  id: number;
  title: string;
  priority: "Low" | "Medium" | "High";
  recurrence?: "Daily" | "Weekly" | "Monthly";
  dependencies?: number;
  status: "done" | "not done";
  dependency?: number;
};

type TaskState = {
  tasks: Task[];
  searchQuery: string;
  priorityFilter: string;
  statusFilter: string;
  loading: boolean;
  addTask: (task: Omit<Task, "id" | "completed">) => Promise<void>;
  updateTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: string) => void;
  setStatusFilter: (status: string) => void;
  fetchTasks: () => Promise<void>;
};

const API_URL = import.meta.env.VITE_API_URL;

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  searchQuery: "",
  priorityFilter: "All",
  statusFilter: "All",
  fetchTasks: async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data: Task[] = await response.json();
      set({ tasks: data });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },

  addTask: async (task) => {
    try {
      set({ loading: true });
      const response = await fetch(`${API_URL}/tasks`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ ...task }),
      });
      if (!response.ok) throw new Error("Failed to create task");
      const data: Task = await response.json();

      setTimeout(() => {
        set((state) => ({
          tasks: [...state.tasks, { ...data }],
          loading: false,
        }));
      }, 500);
    } catch (error) {
      console.error("Error creating tasks:", error);
      set({ loading: false });
    }
  },
  updateTask: async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({ id, status: "done" }),
      });
      if (!response.ok) {
        if (response.status === 400) {
          const errorMsg = await response.json();
          alert(errorMsg.message);
        }
        throw new Error("Failed to update task");
      }
      const data: Task = await response.json();

      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, status: data.status } : t
        ),
      }));
    } catch (error) {
      console.error("Error updating task", error);
    }
  },
  deleteTask: async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
