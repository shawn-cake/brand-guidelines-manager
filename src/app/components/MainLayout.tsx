import { Outlet } from 'react-router';
import { Sidebar } from '@/app/components/Sidebar';

export function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
