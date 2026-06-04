// Mock bookings/customer data — replace with Supabase queries when keys arrive

export type BookingStatus = 'booked' | 'assigned' | 'on_route' | 'collected' | 'delivered' | 'reported' | 'cancelled';
export type CollectionType = 'home' | 'provider';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Booking {
  id: string;
  customer_id: string;
  customer_name: string;
  mobile: string;
  provider_name: string;
  client_id: string;
  collection_type: CollectionType;
  slot_date: string;
  slot_time: string;
  city: string;
  state_code: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  agent_name: string | null;
  created_at: string;
}

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', customer_id: 'CUST-HOS001-2026-BLD-000001', customer_name: 'Rajesh Patel', mobile: '9876543210', provider_name: 'Apollo Specialty Hospital', client_id: 'CLI-TN-2026-HOS-000001', collection_type: 'home', slot_date: '2026-05-10', slot_time: '07:00 AM – 09:00 AM', city: 'Chennai', state_code: 'TN', status: 'assigned', payment_status: 'paid', agent_name: 'Karthik R', created_at: '2026-05-09T06:00:00Z' },
  { id: 'b2', customer_id: 'CUST-CLI002-2026-BLD-000001', customer_name: 'Sunita Mehta', mobile: '9123456789', provider_name: 'Wellness Clinic', client_id: 'CLI-KA-2026-CLI-000002', collection_type: 'provider', slot_date: '2026-05-10', slot_time: '09:00 AM – 11:00 AM', city: 'Mysuru', state_code: 'KA', status: 'booked', payment_status: 'paid', agent_name: null, created_at: '2026-05-09T07:30:00Z' },
  { id: 'b3', customer_id: 'CUST-HOS001-2026-BLD-000002', customer_name: 'Deepak Iyer', mobile: '8765432109', provider_name: 'Apollo Specialty Hospital', client_id: 'CLI-TN-2026-HOS-000001', collection_type: 'home', slot_date: '2026-05-10', slot_time: '07:00 AM – 09:00 AM', city: 'Chennai', state_code: 'TN', status: 'booked', payment_status: 'pending', agent_name: null, created_at: '2026-05-09T08:00:00Z' },
  { id: 'b4', customer_id: 'CUST-HOS003-2026-BLD-000001', customer_name: 'Priya Sharma', mobile: '7654321098', provider_name: 'Max Super Speciality', client_id: 'CLI-DL-2026-HOS-000003', collection_type: 'home', slot_date: '2026-05-09', slot_time: '11:00 AM – 01:00 PM', city: 'New Delhi', state_code: 'DL', status: 'collected', payment_status: 'paid', agent_name: 'Ravi S', created_at: '2026-05-08T18:00:00Z' },
  { id: 'b5', customer_id: 'CUST-HOS003-2026-BLD-000002', customer_name: 'Arun Kumar', mobile: '6543210987', provider_name: 'Max Super Speciality', client_id: 'CLI-DL-2026-HOS-000003', collection_type: 'provider', slot_date: '2026-05-11', slot_time: '09:00 AM – 11:00 AM', city: 'New Delhi', state_code: 'DL', status: 'booked', payment_status: 'pending', agent_name: null, created_at: '2026-05-09T09:00:00Z' },
  { id: 'b6', customer_id: 'CUST-CLI002-2026-BLD-000002', customer_name: 'Kavitha Nair', mobile: '9988776655', provider_name: 'Wellness Clinic', client_id: 'CLI-KA-2026-CLI-000002', collection_type: 'home', slot_date: '2026-05-09', slot_time: '07:00 AM – 09:00 AM', city: 'Mysuru', state_code: 'KA', status: 'reported', payment_status: 'paid', agent_name: 'Suresh M', created_at: '2026-05-08T06:00:00Z' },
];

export interface Agent {
  id: string;
  name: string;
  mobile: string;
  zone: string;
  city: string;
  state_code: string;
  status: 'active' | 'inactive';
  active_bookings: number;
}

export const MOCK_AGENTS: Agent[] = [
  { id: 'ag1', name: 'Karthik R', mobile: '9876500001', zone: 'North Chennai', city: 'Chennai', state_code: 'TN', status: 'active', active_bookings: 2 },
  { id: 'ag2', name: 'Ravi S', mobile: '9876500002', zone: 'Central Delhi', city: 'New Delhi', state_code: 'DL', status: 'active', active_bookings: 1 },
  { id: 'ag3', name: 'Suresh M', mobile: '9876500003', zone: 'Mysuru East', city: 'Mysuru', state_code: 'KA', status: 'active', active_bookings: 0 },
  { id: 'ag4', name: 'Deepa K', mobile: '9876500004', zone: 'South Chennai', city: 'Chennai', state_code: 'TN', status: 'inactive', active_bookings: 0 },
];
