import { getSlotConfiguration } from '@/app/actions/slots';
import { SlotsClient } from './SlotsClient';

export const revalidate = 0;

export default async function SlotsPage() {
  const slots = await getSlotConfiguration();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SlotsClient initialSlots={slots} />
    </div>
  );
}
