import { getTasksByUserId } from '@/lib/services/tasks';
import { TasksClient } from '@/app/tasks/TasksClient';

// Mock user ID - sẽ thay bằng auth sau
const MOCK_USER_ID = 1;

export default async function TasksPage() {
  const tasks = await getTasksByUserId(MOCK_USER_ID);

  return <TasksClient initialTasks={tasks} userId={MOCK_USER_ID} />;
}
