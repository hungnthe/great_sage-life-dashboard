'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseCard } from '@/components/shared/BaseCard';
import { Badge } from '@/components/shared/Badge';
import { StatusIndicator, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '@/components/shared/StatusIndicator';
import type { Task, TaskType, TaskPriority, TaskStatus } from '@/types';
import { formatDate } from '@/lib/utils/formatting';
import { ArrowLeft, Calendar, Edit, Trash2, Save, X } from 'lucide-react';
import Link from 'next/link';

interface TaskDetailClientProps {
  task: Task;
}

export function TaskDetailClient({ task: initialTask }: TaskDetailClientProps) {
  const router = useRouter();
  const [task, setTask] = useState(initialTask);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || '',
    type: task.type,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/tasks');
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          type: editForm.type,
          status: editForm.status,
          priority: editForm.priority,
          dueDate: editForm.dueDate ? new Date(editForm.dueDate) : null,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const getTypeVariant = (type: TaskType): 'blue' | 'green' | 'purple' => {
    switch (type) {
      case 'DAILY': return 'blue';
      case 'MAIN': return 'green';
      case 'OTHER': return 'purple';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-100" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/tasks"
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Quay lại danh sách</span>
            </Link>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Edit size={18} />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Xóa
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save size={18} />
                    Lưu
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        title: task.title,
                        description: task.description || '',
                        type: task.type,
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                      });
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <X size={18} />
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BaseCard className="bg-white/80 backdrop-blur">
          {!isEditing ? (
            <div className="space-y-6">
              {/* Title and Type */}
              <div className="flex items-start justify-between gap-6">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">{task.title}</h1>
                <Badge 
                  label={task.type} 
                  variant={getTypeVariant(task.type)}
                />
              </div>

              {/* Status and Priority */}
              <div className="space-y-5">
                <div>
                  <p className="text-base text-gray-500 mb-2 font-medium">Trạng thái</p>
                  <StatusIndicator 
                    status={task.status}
                    colorMap={TASK_STATUS_COLORS}
                  />
                </div>
                <div>
                  <p className="text-base text-gray-500 mb-2 font-medium">Độ ưu tiên</p>
                  <StatusIndicator 
                    status={task.priority}
                    colorMap={TASK_PRIORITY_COLORS}
                  />
                </div>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center gap-3 text-gray-700 text-lg">
                  <Calendar size={28} />
                  <span className="font-medium">Hạn chót:</span>
                  <span>{formatDate(new Date(task.dueDate), 'long')}</span>
                </div>
              )}

              {/* Description */}
              {task.description && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Mô tả</h2>
                  <p className="text-lg text-gray-700 whitespace-pre-wrap leading-relaxed">{task.description}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-8 border-t border-gray-200 text-base text-gray-600 space-y-2">
                <p>Tạo lúc: {formatDate(new Date(task.createdAt), 'long')}</p>
                <p>Cập nhật: {formatDate(new Date(task.updatedAt), 'long')}</p>
                {task.completedAt && (
                  <p>Hoàn thành: {formatDate(new Date(task.completedAt), 'long')}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Mô tả
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={6}
                  className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Loại
                  </label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as TaskType })}
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="DAILY">DAILY</option>
                    <option value="MAIN">MAIN</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Trạng thái
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as TaskStatus })}
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Độ ưu tiên
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as TaskPriority })}
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Hạn chót
                  </label>
                  <input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}
        </BaseCard>
      </div>
    </div>
  );
}