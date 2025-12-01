import { BaseCard } from '@/components/shared/BaseCard';
import { Badge } from '@/components/shared/Badge';
import { StatusIndicator, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '@/components/shared/StatusIndicator';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  ListTodo,
  FolderKanban,
  BookOpen,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data - sẽ thay bằng data thật từ database sau
  const stats = {
    tasksCompletedThisWeek: 12,
    studyHoursThisWeek: 15.5,
    habitCompletionRate: 85,
    activeProjectsCount: 3,
  };

  const todayTasks = [
    {
      id: 1,
      title: 'Review pull requests',
      type: 'DAILY',
      status: 'TODO',
      priority: 'HIGH',
    },
    {
      id: 2,
      title: 'Complete project documentation',
      type: 'MAIN',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
    },
    {
      id: 3,
      title: 'Team meeting at 3 PM',
      type: 'OTHER',
      status: 'TODO',
      priority: 'MEDIUM',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Chào mừng trở lại, Đại Hiền Giả 👋
              </p>
            </div>
            <Link 
              href="/"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              ← Quay lại
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tasks Completed */}
          <BaseCard hoverable={false} className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Tasks hoàn thành</p>
                <p className="text-3xl font-bold text-green-900">{stats.tasksCompletedThisWeek}</p>
                <p className="text-xs text-green-600 mt-1">Tuần này</p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </BaseCard>

          {/* Study Hours */}
          <BaseCard hoverable={false} className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Giờ học tập</p>
                <p className="text-3xl font-bold text-blue-900">{stats.studyHoursThisWeek}h</p>
                <p className="text-xs text-blue-600 mt-1">Tuần này</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </BaseCard>

          {/* Habit Completion */}
          <BaseCard hoverable={false} className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Thói quen</p>
                <p className="text-3xl font-bold text-purple-900">{stats.habitCompletionRate}%</p>
                <p className="text-xs text-purple-600 mt-1">Tỷ lệ hoàn thành</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </BaseCard>

          {/* Active Projects */}
          <BaseCard hoverable={false} className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">Dự án đang chạy</p>
                <p className="text-3xl font-bold text-orange-900">{stats.activeProjectsCount}</p>
                <p className="text-xs text-orange-600 mt-1">Đang hoạt động</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </BaseCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <div className="lg:col-span-2">
            <BaseCard hoverable={false}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Công việc hôm nay
                </h2>
                <Link 
                  href="/tasks"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Xem tất cả →
                </Link>
              </div>

              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <BaseCard 
                    key={task.id} 
                    hoverable={true}
                    className="bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            label={task.type} 
                            variant={
                              task.type === 'DAILY' ? 'blue' : 
                              task.type === 'MAIN' ? 'green' : 'purple'
                            }
                            size="sm"
                          />
                          <StatusIndicator 
                            status={task.priority}
                            colorMap={TASK_PRIORITY_COLORS}
                            size="sm"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      </div>
                      <StatusIndicator 
                        status={task.status}
                        colorMap={TASK_STATUS_COLORS}
                        size="sm"
                      />
                    </div>
                  </BaseCard>
                ))}
              </div>
            </BaseCard>
          </div>

          {/* Quick Actions */}
          <div>
            <BaseCard hoverable={false}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Truy cập nhanh
              </h2>

              <div className="space-y-3">
                <Link href="/tasks">
                  <BaseCard hoverable={true} className="bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <ListTodo className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Tasks</p>
                        <p className="text-xs text-gray-600">Quản lý công việc</p>
                      </div>
                    </div>
                  </BaseCard>
                </Link>

                <Link href="/projects">
                  <BaseCard hoverable={true} className="bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <FolderKanban className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Projects</p>
                        <p className="text-xs text-gray-600">Quản lý dự án</p>
                      </div>
                    </div>
                  </BaseCard>
                </Link>

                <Link href="/study-items">
                  <BaseCard hoverable={true} className="bg-purple-50 border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Study Items</p>
                        <p className="text-xs text-gray-600">Quản lý học tập</p>
                      </div>
                    </div>
                  </BaseCard>
                </Link>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  );
}
