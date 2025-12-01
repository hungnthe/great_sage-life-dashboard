'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { BaseCard } from '@/components/shared/BaseCard';
import type { Project, ProjectStatus } from '@/types';
import { 
  Plus, 
  FolderKanban, 
  ArrowLeft,
  Filter,
  X
} from 'lucide-react';
import Link from 'next/link';

interface ProjectsClientProps {
  initialProjects: Project[];
  userId: number;
}

export function ProjectsClient({ initialProjects, userId }: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    if (filterStatus !== 'ALL' && project.status !== filterStatus) return false;
    return true;
  });

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-slate-100" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-lg">
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
                  <FolderKanban size={40} />
                  Quản lý Dự án
                </h1>
                <p className="text-purple-100 mt-2 text-lg">
                  {filteredProjects.length} dự án
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateProject}
              className="px-8 py-4 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-semibold flex items-center gap-3 shadow-lg text-lg"
            >
              <Plus size={24} />
              Tạo dự án mới
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
              className="px-5 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_HOLD">ON_HOLD</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>

            {filterStatus !== 'ALL' && (
              <button
                onClick={() => setFilterStatus('ALL')}
                className="px-5 py-3 text-base text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <X size={18} />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </BaseCard>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <ProjectsGrid
            projects={filteredProjects}
            onProjectClick={handleProjectClick}
          />
        ) : (
          <EmptyState
            icon={<FolderKanban size={48} />}
            title="Chưa có dự án nào"
            description="Bắt đầu bằng cách tạo dự án đầu tiên của bạn"
            actionLabel="Tạo dự án"
            onAction={handleCreateProject}
          />
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateProjectModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newProject) => {
            setProjects([...projects, newProject]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

// Create Project Modal Component
function CreateProjectModal({
  userId,
  onClose,
  onSuccess,
}: {
  userId: number;
  onClose: () => void;
  onSuccess: (project: Project) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetHours, setTargetHours] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name,
          description,
          targetHours: parseFloat(targetHours) || 0,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        onSuccess(newProject);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Tạo dự án mới</h2>
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
              Tên dự án *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nhập tên dự án..."
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nhập mô tả chi tiết..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mục tiêu giờ
            </label>
            <input
              type="number"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              min="0"
              step="0.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Số giờ mục tiêu..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
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
              disabled={loading || !name}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-lg hover:from-purple-700 hover:to-pink-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang tạo...' : 'Tạo dự án'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
