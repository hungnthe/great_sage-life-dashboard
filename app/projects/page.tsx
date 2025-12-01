import { getProjectsByUserId } from '@/lib/services/projects';
import { ProjectsClient } from './ProjectsClient';

export default async function ProjectsPage() {
  const userId = 1; // TODO: Get from auth
  const projects = await getProjectsByUserId(userId);

  return <ProjectsClient initialProjects={projects} userId={userId} />;
}
