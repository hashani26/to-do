export type Task = {
    id: number;
    title: string;
    status: 'done' | 'not done';
    priority: 'Low' | 'Medium' | 'High';
    recurrence?: 'daily' | 'weekly' | 'monthly';
    dependency?: number;
  };
  
  export let tasks: Task[] = [];
  