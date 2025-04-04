import { useTaskStore } from "../store/taskStore";

const TaskFilters = () => {
  const { searchQuery, priorityFilter, statusFilter, setSearchQuery, setPriorityFilter, setStatusFilter, setSort, sort } =
    useTaskStore();

  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-gray-100 p-4 rounded-lg mb-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {/* Priority Filter */}
      <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="p-2 border rounded">
        <option value="All">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* Status Filter */}
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded">
        <option value="All">All Status</option>
        <option value="done">Done</option>
        <option value="not done">Pending</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)} className="p-2 border rounded">
        <option value="All">Default</option>
        <option value="pAsc">Priority Ascending</option>
        <option value="pDsc">Priority Decending</option>
        <option value="sAsc">Status Ascending</option>
        <option value="sDsc">Status Decending</option>
      </select>
    </div>
  );
};

export default TaskFilters;
