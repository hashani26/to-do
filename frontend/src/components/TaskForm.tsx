import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';

const TaskForm = () => {
  const { addTask, tasks } = useTaskStore();
  //check add task

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [recurrence, setRecurrence] = useState<
    'Daily' | 'Weekly' | 'Monthly' | ''
  >('');
  const [dependency, setDependency] = useState<number | ''>('');

  // const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      priority,
      recurrence: recurrence || undefined,
      dependency: dependency || undefined,
      status: 'not done',
    });
    setTitle('');
    setRecurrence('');
    setDependency('');
    setPriority('Low');
  };

  return (
    <form onSubmit={handleSubmit} className='bg-gray-100 p-4 rounded-lg mb-4'>
      <input
        type='text'
        placeholder='Task title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='w-full p-2 border rounded mb-2'
        maxLength={40}
      />
      <div className='flex gap-2 mb-2'>
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as 'Low' | 'Medium' | 'High')
          }
          className='p-2 border rounded'
        >
          <option value='Low'>Low</option>
          <option value='Medium'>Medium</option>
          <option value='High'>High</option>
        </select>
        <select
          value={recurrence}
          onChange={(e) =>
            setRecurrence(e.target.value as 'Daily' | 'Weekly' | 'Monthly' | '')
          }
          className='p-2 border rounded'
        >
          <option value=''>No Recurrence</option>
          <option value='daily'>Daily</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
        </select>
        <select
          value={dependency}
          onChange={(e) =>
            setDependency(e.target.value === '' ? '' : Number(e.target.value))
          }
          className='w-full p-2 border rounded mb-2'
        >
          <option value=''>No Dependency</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>
      <button
        type='submit'
        disabled={!title}
        className='bg-black text-white px-4 py-2 rounded cursor-pointer disabled:bg-gray-700 disabled:cursor-auto'
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
