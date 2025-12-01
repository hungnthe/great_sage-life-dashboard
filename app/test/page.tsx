'use client';

import { BaseCard } from '@/components/shared/BaseCard';
import { Badge } from '@/components/shared/Badge';
import { StatusIndicator, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '@/components/shared/StatusIndicator';
import { EmptyState } from '@/components/shared/EmptyState';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Great Sage - Component Test Page</h1>
        
        {/* BaseCard Tests */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">BaseCard Component</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseCard>
              <h3 className="font-semibold mb-2">Basic Card</h3>
              <p className="text-sm text-gray-600">This is a basic card without hover or click</p>
            </BaseCard>
            
            <BaseCard hoverable={true}>
              <h3 className="font-semibold mb-2">Hoverable Card</h3>
              <p className="text-sm text-gray-600">Hover over me to see the effect</p>
            </BaseCard>
            
            <BaseCard onClick={() => alert('Card clicked!')} hoverable={true}>
              <h3 className="font-semibold mb-2">Clickable Card</h3>
              <p className="text-sm text-gray-600">Click me!</p>
            </BaseCard>
          </div>
        </section>

        {/* Badge Tests */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Badge Component</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Task Types:</h3>
              <div className="flex flex-wrap gap-2">
                <Badge label="DAILY" variant="blue" />
                <Badge label="MAIN" variant="green" />
                <Badge label="OTHER" variant="purple" />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Study Types:</h3>
              <div className="flex flex-wrap gap-2">
                <Badge label="SUBJECT" variant="blue" />
                <Badge label="COURSE" variant="green" />
                <Badge label="SELF" variant="purple" />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">With Icons:</h3>
              <div className="flex flex-wrap gap-2">
                <Badge label="Active" variant="green" icon={<CheckCircle size={14} />} />
                <Badge label="Warning" variant="yellow" icon={<AlertCircle size={14} />} />
                <Badge label="Error" variant="red" icon={<AlertCircle size={14} />} />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Sizes:</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge label="Small" variant="blue" size="sm" />
                <Badge label="Medium" variant="blue" size="md" />
                <Badge label="Large" variant="blue" size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* StatusIndicator Tests */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">StatusIndicator Component</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Task Status:</h3>
              <div className="flex flex-wrap gap-2">
                <StatusIndicator status="TODO" colorMap={TASK_STATUS_COLORS} />
                <StatusIndicator status="IN_PROGRESS" colorMap={TASK_STATUS_COLORS} />
                <StatusIndicator status="DONE" colorMap={TASK_STATUS_COLORS} />
                <StatusIndicator status="CANCELLED" colorMap={TASK_STATUS_COLORS} />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Task Priority:</h3>
              <div className="flex flex-wrap gap-2">
                <StatusIndicator status="LOW" colorMap={TASK_PRIORITY_COLORS} />
                <StatusIndicator status="MEDIUM" colorMap={TASK_PRIORITY_COLORS} />
                <StatusIndicator status="HIGH" colorMap={TASK_PRIORITY_COLORS} />
                <StatusIndicator status="URGENT" colorMap={TASK_PRIORITY_COLORS} />
              </div>
            </div>
          </div>
        </section>

        {/* EmptyState Tests */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">EmptyState Component</h2>
          <BaseCard>
            <EmptyState
              icon={<Calendar size={48} />}
              title="No tasks yet"
              description="You haven't created any tasks. Start by adding your first task to get organized."
              actionLabel="Add Task"
              onAction={() => alert('Add task clicked!')}
            />
          </BaseCard>
        </section>

        {/* Combined Example - Task Card */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Combined Example - Task Card</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseCard hoverable={true} onClick={() => alert('Task clicked!')}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">Complete project documentation</h3>
                  <Badge label="MAIN" variant="green" size="sm" />
                </div>
                
                <p className="text-sm text-gray-600">
                  Write comprehensive documentation for the Great Sage project including setup instructions and API docs.
                </p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusIndicator status="IN_PROGRESS" colorMap={TASK_STATUS_COLORS} size="sm" />
                  <StatusIndicator status="HIGH" colorMap={TASK_PRIORITY_COLORS} size="sm" />
                  <span className="text-xs text-gray-500">Due: Tomorrow</span>
                </div>
              </div>
            </BaseCard>

            <BaseCard hoverable={true} onClick={() => alert('Task clicked!')}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">Review pull requests</h3>
                  <Badge label="DAILY" variant="blue" size="sm" />
                </div>
                
                <p className="text-sm text-gray-600">
                  Review and merge pending pull requests from team members.
                </p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusIndicator status="TODO" colorMap={TASK_STATUS_COLORS} size="sm" />
                  <StatusIndicator status="MEDIUM" colorMap={TASK_PRIORITY_COLORS} size="sm" />
                  <span className="text-xs text-gray-500">Due: Today</span>
                </div>
              </div>
            </BaseCard>
          </div>
        </section>
      </div>
    </div>
  );
}
