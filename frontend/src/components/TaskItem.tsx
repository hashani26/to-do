import { Task } from '../store/taskStore';
import { useTaskStore } from '../store/taskStore';
import { FaTrash, FaRedo } from 'react-icons/fa';

const TaskItem = ({ task }: { task: Task }) => {
  const { updateTask, deleteTask } = useTaskStore();

  return (
    <div className='flex items-center justify-between bg-white p-4 shadow rounded-lg'>
      <div className='flex items-center gap-2'>
        <input
          className='cursor-pointer'
          type='checkbox'
          checked={task.status === 'done'}
          onChange={() => updateTask(task.id)}
        />
        <span
          className={`${
            task.status === 'done'
              ? 'line-through text-gray-400'
              : 'font-medium'
          }`}
        >
          {task.title}
        </span>
        {task.priority === 'High' ? (
          <span className='bg-red-500 text-white px-2 py-1 text-xs rounded'>
            High
          </span>
        ) : task.priority === 'Medium' ? (
          <span className='bg-yellow-500 text-white px-2 py-1 text-xs rounded'>
            Medium
          </span>
        ) : (
          <span className='bg-green-500 text-white px-2 py-1 text-xs rounded'>
            Low
          </span>
        )}
        {task.recurrence && (
          <span className='bg-gray-200 px-2 py-1 text-xs rounded flex items-center gap-1'>
            <FaRedo className='text-gray-600' />
            {task.recurrence}
          </span>
        )}
      </div>
      <div className='flex gap-2'>
        <button onClick={() => deleteTask(task.id)} className='text-red-500 cursor-pointer'>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
