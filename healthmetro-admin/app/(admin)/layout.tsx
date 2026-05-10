import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { MOCK_PROVIDERS } from '@/data/providers';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pendingCount = MOCK_PROVIDERS.filter(p => p.status === 'pending').length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar pendingCount={pendingCount} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#F0F2F7]">
          {children}
        </main>
      </div>
    </div>
  );
}
