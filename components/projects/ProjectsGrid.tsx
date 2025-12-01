'use client';

import { ProjectCard } from './ProjectCard';
import type { Project } from '@/types';

interface ProjectsGridProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

/**
 * ProjectsGrid - Responsive grid layout for projects
 */
export function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={onProjectClick}
        />
      ))}
    </div>
  );
}
