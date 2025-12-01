'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TasksGrid } from '@/components/tasks/TasksGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { BaseCard } from '@/components/shared/BaseCard';
import type { Task, TaskType, TaskPriority } from '@/types';
import { sortByPriority } from '@/lib/utils/sorting';
import { 
  Plus, 
  ListTodo, 
  ArrowLeft,
  Filter,
  X
} from 'lucide-react';
import Link from 'next/link';

interface TasksClientProps {
  initialTasks: Task[];
  userId: number;
}

export function TasksClient({ initialTasks, userId }: TasksClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(sortByPriority(initialTasks));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== 'ALL' && task.status !== filterStatus) return false;
    if (filterType !== 'ALL' && task.type !== filterType) return false;
    return true;
  });

  const handleTaskClick = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  const handleStatusChange = async (taskId: number, newStatus: Task['status']) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleCreateTask = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-100" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-3 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={28} />
              </Link>
              <div>
                <h1 className="text-4xl font-bold flex items-center gap-4">
                  <ListTodo size={40} />
                  Quản lý Công việc
                </h1>
                <p className="text-cyan-100 mt-2 text-lg">
                  {filteredTasks.length} công việc
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateTask}
              className="px-8 py-4 bg-white text-cyan-700 rounded-lg hover:bg-cyan-50 transition-colors font-semibold flex items-center gap-3 shadow-lg text-lg"
            >
              <Plus size={24} />
              Tạo công việc mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <BaseCard className="mb-8 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 text-gray-700 font-medium text-lg">
              <Filter size={24} />
              <span>Lọc:</span>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-5 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-5 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            >
              <option value="ALL">Tất cả loại</option>
              <option value="DAILY">DAILY</option>
              <option value="MAIN">MAIN</option>
              <option value="OTHER">OTHER</option>
            </select>

            {(filterStatus !== 'ALL' || filterType !== 'ALL') && (
              <button
                onClick={() => {
                  setFilterStatus('ALL');
                  setFilterType('ALL');
                }}
                className="px-5 py-3 text-base text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <X size={18} />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </BaseCard>

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <TasksGrid
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <EmptyState
            icon={<ListTodo size={48} />}
            title="Chưa có công việc nào"
            description="Bắt đầu bằng cách tạo công việc đầu tiên của bạn"
            actionLabel="Tạo công việc"
            onAction={handleCreateTask}
          />
        )}
      </div>

      {/* Create Modal - Simple version */}
      {showCreateModal && (
        <CreateTaskModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newTask) => {
            setTasks(sortByPriority([...tasks, newTask]));
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

// Create Task Modal Component
function CreateTaskModal({
  userId,
  onClose,
  onSuccess,
}: {
  userId: number;
  onClose: () => void;
  onSuccess: (task: Task) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('OTHER');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title,
          description,
          type,
          priority,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        onSuccess(newTask);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-600 to-blue-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Tạo công việc mới</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Nhập tiêu đề công việc..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Nhập mô tả chi tiết..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="DAILY">DAILY</option>
                <option value="MAIN">MAIN</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hạn chót
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !title}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg hover:from-cyan-700 hover:to-blue-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang tạo...' : 'Tạo công việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
