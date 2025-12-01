"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Module {
  name: string;
  url: string;
}

interface LifeDashboardProps {
  modules: Module[];
}

// Component Nền Động (Chứa lưới và các đốm sáng)
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {/* 1. Nền Gradient Xanh Sâu */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0B1121] to-[#0a0e2e]"></div>

    {/* 2. Họa tiết lưới sáng mờ (Grid Pattern) */}
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(103, 232, 249, 0.8) 1px, transparent 0)',
        backgroundSize: '50px 50px'
      }}
    ></div>

    {/* 3. Các đốm sáng năng lượng trôi nổi (Floating Orbs) */}
    <motion.div
      animate={{ x: [-100, 100, -100], y: [-50, 50, -50], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] mix-blend-screen"
    />
    <motion.div
      animate={{ x: [50, -50, 50], y: [100, -100, 100], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen"
    />
  </div>
);


export default function LifeDashboard({ modules }: LifeDashboardProps) {
  const router = useRouter();

  const handleModuleClick = (module: Module) => {
    router.push(module.url);
  };

  // --- 2. GIAO DIỆN XOAY (MÀN HÌNH CHÍNH) ---
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center gap-16 text-white overflow-hidden">
      <AnimatedBackground />

      <div className="flex flex-col items-center gap-4 z-10 relative">
        <span className="text-xl md:text-3xl tracking-[0.5em] uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
          Great Sage System
        </span>
        <h1 className="text-6xl md:text-8xl font-black text-center text-white drop-shadow-2xl tracking-tighter">
          Life<span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">Core</span>
        </h1>
      </div>

      {/* CONTAINER CHÍNH CHỨA CẢ VÒNG XOAY VÀ TÂM */}
      <div className="relative w-[600px] h-[600px] flex items-center justify-center z-10">

        {/* A. Ô TRUNG TÂM (Đứng yên - Không có motion.div bao quanh) */}
        <div className="absolute z-20 w-48 h-48 rounded-full backdrop-blur-xl bg-blue-900/80 border-[3px] border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center text-center px-4 group">
          {/* Hiệu ứng pulse ở tâm */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-200/20 animate-ping opacity-30 delay-75"></div>

          <div className="text-xs text-cyan-300 font-bold uppercase mb-1 tracking-widest drop-shadow">
            Chủ nhân
          </div>
          <div className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
            Đại Hiền Giả
          </div>
          <div className="mt-2 text-[10px] text-cyan-200/70">System Online v1.0</div>
        </div>

        {/* B. VÒNG XOAY VỆ TINH (Xoay quanh tâm) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          {/* Các nút vệ tinh - Modules thực tế */}
          {modules.map((module, i) => {
            const angle = (i / modules.length) * Math.PI * 2;
            const radius = 260;
            const buttonSize = 110;
            const halfSize = buttonSize / 2;

            return (
              <motion.button
                key={i}
                onClick={() => handleModuleClick(module)}
                className="absolute w-[110px] h-[110px] bg-white border-4 border-cyan-500/30 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer flex items-center justify-center text-center text-sm font-extrabold text-gray-900 hover:shadow-[0_0_40px_rgba(255,255,255,0.8)] hover:scale-110 hover:border-cyan-400 transition-all duration-300 z-20 group"
                style={{
                  top: "50%",
                  left: "50%",
                  marginTop: Math.sin(angle) * radius - halfSize,
                  marginLeft: Math.cos(angle) * radius - halfSize,
                }}
                whileHover={{ scale: 1.15, rotate: -360 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Hiệu ứng bóng sáng bên trong khi hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_15px_rgba(6,182,212,0.6)]"></div>

                {/* Chữ xoay ngược để luôn đứng thẳng */}
                <motion.span
                  className="px-2 leading-tight block drop-shadow-none"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                >
                  {module.name}
                </motion.span>
              </motion.button>
            );
          })}
        </motion.div>

      </div>

      <div className="text-xs uppercase tracking-[0.3em] text-cyan-500/70 font-semibold z-10 animate-pulse">
        Kích hoạt một mô-đun để bắt đầu
      </div>

      {/* NÚT DASHBOARD ĐẶC BIỆT */}
      <motion.a
        href="/dashboard"
        className="fixed bottom-8 right-8 z-30 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* Hiệu ứng glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Nút chính */}
          <div className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-2xl border-2 border-cyan-400/50 flex items-center gap-3">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
            <span className="text-white font-bold text-lg tracking-wide">
              Dashboard
            </span>
          </div>
        </div>
      </motion.a>
    </div>
  );
}