import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/services/projects';
import { ProjectDetailClient } from './ProjectDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(parseInt(id));

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
