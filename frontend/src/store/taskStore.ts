import { create } from "zustand";
import { toast } from "react-hot-toast";

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

export type TaskState = {
  tasks: Task[];
  searchQuery: string;
  priorityFilter: string;
  statusFilter: string;
  sort: string;
  loading: boolean;
  addTask: (task: Omit<Task, "id" | "completed">) => Promise<void>;
  updateTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setSearchQuery: (query: string) => Promise<void>;
  setSort: (status: string) => void;
  fetchTasks: (priority?: string, status?: string) => Promise<void>;
};

const API_URL = import.meta.env.VITE_API_URL;

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  searchQuery: "",
  priorityFilter: "All",
  statusFilter: "All",
  sort: "All",
  fetchTasks: async (priority, status) => {
    try {
      const params = new URLSearchParams();
      if (priority && priority !== "All") params.set("priority", priority);
      if (status && status !== "All") params.set("status", status);

      const queryString = params.toString() ? `?${params.toString()}` : "";

      const response = await fetch(`${API_URL}/tasks${queryString}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data: Task[] = await response.json();
      set((state) => ({
        tasks: data,
        priorityFilter: priority,
        statusFilter: status,
        searchQuery: state.searchQuery,
      }));
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
          t.id === id ? { ...t, status: data.status } : t,
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
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task", error);
    }
  },
  setSearchQuery: async (query) => {
    try {
      if (!query.trim()) {
        set({ searchQuery: "" });
        await useTaskStore
          .getState()
          .fetchTasks(
            useTaskStore.getState().priorityFilter,
            useTaskStore.getState().statusFilter,
          );
        return;
      }

      const params = new URLSearchParams();
      if (query) params.set("title", query);
      const response = await fetch(
        `${API_URL}/tasks/search?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error("failed to search tasks");
      }
      const data: Task[] = await response.json();
      set({ searchQuery: query, tasks: data });
    } catch (error) {
      console.error("Error searching tasks", error);
    }
  },
  setSort: (status) => set({ sort: status }),
}));
