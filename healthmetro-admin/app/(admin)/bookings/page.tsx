import { createAdminClient } from '@/utils/supabase/admin';
import { BookingsClient, Booking } from './BookingsClient';

export const revalidate = 0;

export default async function BookingsPage() {
  const supabase = createAdminClient();

  // Fetch bookings with joined customer and provider data
  const { data: bookingsData, error } = await supabase
    .from('bookings')
    .select(`
      id,
      slot_date,
      slot_time,
      status,
      payment_status,
      created_at,
      customers (
        full_name,
        mobile,
        customer_id,
        collection_type
      ),
      providers (
        provider_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return <div>Error loading bookings. Please check server logs.</div>;
  }

  // Map database fields to the UI Booking interface
  const initialBookings: Booking[] = (bookingsData || []).map((b: any) => ({
    id: b.id,
    customer_name: b.customers?.full_name || 'Unknown',
    mobile: b.customers?.mobile || 'Unknown',
    customer_id: b.customers?.customer_id || '-',
    provider_name: b.providers?.provider_name || 'Unknown',
    collection_type: b.customers?.collection_type || 'provider',
    slot_date: b.slot_date,
    slot_time: b.slot_time,
    status: b.status,
    payment_status: b.payment_status,
    agent_name: undefined, // Add agent mapping here if an agents table exists later
  }));

  return <BookingsClient initialBookings={initialBookings} />;
}
