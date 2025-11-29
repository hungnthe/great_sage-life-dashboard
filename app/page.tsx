import { db } from "@/lib/db";

export default async function Home() {
  // Thử lấy tất cả user từ database
  const users = await db.users.findMany();

  return (
    <main>
      <h1>Danh sách Users từ MySQL:</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </main>
  );
}