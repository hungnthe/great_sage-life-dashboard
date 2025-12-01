import { notFound } from 'next/navigation';
import { getTaskById } from '@/lib/services/tasks';
import { TaskDetailClient } from './TaskDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  const task = await getTaskById(parseInt(id));

  if (!task) {
    notFound();
  }

  return <TaskDetailClient task={task} />;
}
