// app/page.tsx
import LifeDashboard from "@/components/LifeDashboard";

// Các module thực tế từ database
async function getModulesData() {
  // Các module chính trong hệ thống Great Sage
  return [
    { name: "Tasks", url: "/tasks" },
    { name: "Projects", url: "/projects" },
    { name: "Study Items", url: "/study-items" },
    { name: "Study Schedule", url: "/study-schedule" },
    { name: "Habits", url: "/habits" },
    { name: "Quick Notes", url: "/notes" },
    { name: "Bookmarks", url: "/bookmarks" },
  ];
}

export default async function Home() {
  // 1. Server lấy dữ liệu modules
  const modules = await getModulesData();

  // 2. Server render component Client và truyền data vào
  return (
    <main>
      <LifeDashboard modules={modules} />
    </main>
  );
}