type BadgeVariant = string;

const CONFIG: Record<string, { label: string; classes: string }> = {
  // Provider status
  pending:   { label: 'Pending Review', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved:  { label: 'Approved', classes: 'bg-teal-50 text-teal-700 border-teal-200' },
  rejected:  { label: 'Rejected', classes: 'bg-red-50 text-red-600 border-red-200' },
  // Agent status
  active:    { label: 'Active', classes: 'bg-green-50 text-green-700 border-green-200' },
  inactive:  { label: 'Inactive', classes: 'bg-slate-50 text-slate-500 border-slate-200' },
  // Booking status
  booked:    { label: 'Booked', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  assigned:  { label: 'Agent Assigned', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  on_route:  { label: 'On Route', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  collected: { label: 'Collected', classes: 'bg-orange-50 text-orange-700 border-orange-200' },
  delivered: { label: 'Delivered', classes: 'bg-teal-50 text-teal-700 border-teal-200' },
  reported:  { label: 'Report Ready', classes: 'bg-green-50 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', classes: 'bg-slate-50 text-slate-500 border-slate-200' },
  // Payment
  paid:      { label: 'Paid', classes: 'bg-green-50 text-green-700 border-green-200' },
  failed:    { label: 'Failed', classes: 'bg-red-50 text-red-600 border-red-200' },
  // Collection type
  home:      { label: 'Home Collection', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  provider:  { label: 'At Provider', classes: 'bg-slate-50 text-slate-600 border-slate-200' },
};

export function StatusBadge({ status }: { status: BadgeVariant }) {
  const cfg = CONFIG[status] ?? { label: status, classes: 'bg-slate-50 text-slate-500 border-slate-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.classes} whitespace-nowrap`}>
      {cfg.label}
    </span>
  );
}
