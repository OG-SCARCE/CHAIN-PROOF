import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { cn } from "@/utils/cn";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#02050b] text-white">
      <Header />
      {/* main content area — add top padding to clear the fixed header */}
      <main className="flex-1 transition-all duration-300 pt-24 pb-8 h-full bg-[#02050b]">
        <Outlet />
      </main>
    </div>
  );
}
