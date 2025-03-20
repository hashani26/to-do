import { create } from 'zustand';

//move to a single file to access both fe and be
export type Task = {
  id: number;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  recurrence?: 'Daily' | 'Weekly' | 'Monthly';
  dependencies?: number;
  status: 'done' | 'not done';
  dependency?: number;
};

type TaskState = {
  tasks: Task[];
  searchQuery: string;
  priorityFilter: string;
  statusFilter: string;
  // addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  updateTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: string) => void;
  setStatusFilter: (status: string) => void;
  fetchTasks: () => Promise<void>;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],

  searchQuery: '',
  priorityFilter: 'All',
  statusFilter: 'All',
  fetchTasks: async () => {
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data: Task[] = await response.json();
      set({ tasks: data });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  },

  addTask: async (task) => {
    console.log('🚀 ~ addTask: ~ task:', task);
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ ...task }),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const data: Task = await response.json();

      set((state) => ({
        tasks: [...state.tasks, { ...data }],
      }));
    } catch (error) {
      console.error('Error creating tasks:', error);
    }
  },
  updateTask: async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify({ id, status: 'done' }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const data: Task = await response.json();

      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, status: data.status } : t
        ),
      }));
    } catch (error) {
      console.error('Error updating task', error);
    }
  },
  deleteTask: async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
        // body: JSON.stringify({ id, status: 'done' }),
      })

      if(!response.ok) throw new Error('Failed to delete task')
      // const data = await response.json()
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
