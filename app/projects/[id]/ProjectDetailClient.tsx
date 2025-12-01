'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseCard } from '@/components/shared/BaseCard';
import { StatusIndicator, PROJECT_STATUS_COLORS } from '@/components/shared/StatusIndicator';
import type { Project, ProjectStatus } from '@/types';
import { formatDate } from '@/lib/utils/formatting';
import { ArrowLeft, Calendar, Edit, Trash2, Save, X, Target } from 'lucide-react';
import Link from 'next/link';

interface ProjectDetailClientProps {
  project: Project;
}

export function ProjectDetailClient({ project: initialProject }: ProjectDetailClientProps) {
  const router = useRouter();
  const [project, setProject] = useState(initialProject);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: project.name,
    description: project.description || '',
    status: project.status,
    targetHours: project.targetHours.toString(),
    completedHours: project.completedHours.toString(),
    startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
    endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
  });

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa dự án này?')) return;

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/projects');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          status: editForm.status,
          targetHours: parseFloat(editForm.targetHours),
          completedHours: parseFloat(editForm.completedHours),
          startDate: editForm.startDate ? new Date(editForm.startDate) : null,
          endDate: editForm.endDate ? new Date(editForm.endDate) : null,
        }),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProject(updatedProject);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  // Calculate progress based on completed hours vs target hours
  const calculateProgress = () => {
    return project.targetHours > 0 
      ? Math.min(100, Math.round((project.completedHours / project.targetHours) * 100))
      : 0;
  };

  const progress = calculateProgress();
  
  // Get status label in Vietnamese
  const getStatusLabel = (status: ProjectStatus): string => {
    const labels: Record<ProjectStatus, string> = {
      'ACTIVE': 'hoạt động',
      'ON_HOLD': 'tạm dừng',
      'COMPLETED': 'hoàn thành',
      'ARCHIVED': 'lưu trữ'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-slate-100" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/projects"
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
                        name: project.name,
                        description: project.description || '',
                        status: project.status,
                        targetHours: project.targetHours.toString(),
                        completedHours: project.completedHours.toString(),
                        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
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
              {/* Title */}
              <div>
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">{project.name}</h1>
              </div>

              {/* Status */}
              <div className="space-y-5">
                <div>
                  <p className="text-base text-gray-500 mb-2 font-medium">Trạng thái</p>
                  <StatusIndicator 
                    status={project.status}
                    colorMap={PROJECT_STATUS_COLORS}
                  />
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                {project.status === 'ACTIVE' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-base text-gray-500 font-medium">Tiến độ</p>
                      <span className="text-2xl font-bold text-gray-900">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-lg text-gray-700">
                      <Target size={24} />
                      <span className="font-medium">{project.completedHours}h / {project.targetHours}h</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-lg text-gray-600 bg-gray-50 p-4 rounded-lg">
                    <Target size={24} />
                    <span className="font-medium">Dự án đang {getStatusLabel(project.status)}</span>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                {project.startDate && (
                  <div className="flex items-center gap-3 text-gray-700 text-lg">
                    <Calendar size={28} />
                    <div>
                      <p className="text-sm text-gray-500">Bắt đầu</p>
                      <span className="font-medium">{formatDate(new Date(project.startDate), 'long')}</span>
                    </div>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex items-center gap-3 text-gray-700 text-lg">
                    <Calendar size={28} />
                    <div>
                      <p className="text-sm text-gray-500">Kết thúc</p>
                      <span className="font-medium">{formatDate(new Date(project.endDate), 'long')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {project.description && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Mô tả</h2>
                  <p className="text-lg text-gray-700 whitespace-pre-wrap leading-relaxed">{project.description}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-8 border-t border-gray-200 text-base text-gray-600 space-y-2">
                <p>Tạo lúc: {formatDate(new Date(project.createdAt), 'long')}</p>
                <p>Cập nhật: {formatDate(new Date(project.updatedAt), 'long')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Tên dự án *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Trạng thái
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ProjectStatus })}
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ON_HOLD">ON_HOLD</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Mục tiêu giờ
                  </label>
                  <input
                    type="number"
                    value={editForm.targetHours}
                    onChange={(e) => setEditForm({ ...editForm, targetHours: e.target.value })}
                    min="0"
                    step="0.5"
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Giờ đã hoàn thành
                  </label>
                  <input
                    type="number"
                    value={editForm.completedHours}
                    onChange={(e) => setEditForm({ ...editForm, completedHours: e.target.value })}
                    min="0"
                    step="0.5"
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
