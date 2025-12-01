import { NextRequest, NextResponse } from 'next/server';
import { createProject, getProjectsByUserId } from '@/lib/services/projects';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = parseInt(searchParams.get('userId') || '1');
    
    const projects = await getProjectsByUserId(userId);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating project with data:', body);
    const project = await createProject(body);
    console.log('Project created successfully:', project);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json({ 
      error: 'Failed to create project',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
