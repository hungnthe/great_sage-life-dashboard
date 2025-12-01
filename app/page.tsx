// app/page.tsx
import LifeDashboard from "@/components/LifeDashboard";

// Giả lập hàm lấy dữ liệu từ Server (Sau này bạn sẽ thay bằng Prisma query)
async function getCirclesData() {
  // const circles = await prisma.category.findMany(...)
  
  // Dữ liệu tạm thời:
  return [
    "Khóa học",
    "Công việc",
    "Sức khỏe",
    "Dự án",
    "Thói quen",
    "Tài chính",
    "Giải trí" // Thử thêm 1 cái để thấy vòng tròn tự chia đều
  ];
}

export default async function Home() {
  // 1. Server lấy dữ liệu
  const circles = await getCirclesData();

  // 2. Server render component Client và truyền data vào
  return (
    <main>
      <LifeDashboard initialCircles={circles} />
    </main>
  );
}