import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { createAdminClient } from '@/utils/supabase/admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let pendingCount = 0;
  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from('providers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    pendingCount = count || 0;
  } catch {
    // If env vars missing locally, default to 0
    pendingCount = 0;
  }

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
