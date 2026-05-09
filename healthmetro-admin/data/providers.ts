// Mock provider data — replace with Supabase queries when keys arrive

export type ProviderStatus = 'pending' | 'approved' | 'rejected';

export interface Provider {
  id: string;
  client_id: string | null;
  provider_type: string;
  provider_name: string;
  contact_name: string;
  mobile: string;
  email: string;
  city: string;
  state_code: string;
  status: ProviderStatus;
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export const MOCK_PROVIDERS: Provider[] = [
  { id: '1', client_id: 'CLI-TN-2026-HOS-000001', provider_type: 'Hospital', provider_name: 'Apollo Specialty Hospital', contact_name: 'Dr. Ramesh Kumar', mobile: '9876543210', email: 'ramesh@apollo.in', city: 'Chennai', state_code: 'TN', status: 'approved', submitted_at: '2026-05-01T08:30:00Z', reviewed_at: '2026-05-02T10:00:00Z', rejection_reason: null },
  { id: '2', client_id: null, provider_type: 'Clinic', provider_name: 'City Care Clinic', contact_name: 'Dr. Priya Nair', mobile: '9123456789', email: 'priya@citycare.in', city: 'Coimbatore', state_code: 'TN', status: 'pending', submitted_at: '2026-05-07T14:20:00Z', reviewed_at: null, rejection_reason: null },
  { id: '3', client_id: null, provider_type: 'Pharmacy', provider_name: 'MedPlus Pharmacy', contact_name: 'Arun Sharma', mobile: '8765432109', email: 'arun@medplus.in', city: 'Bengaluru', state_code: 'KA', status: 'pending', submitted_at: '2026-05-08T09:15:00Z', reviewed_at: null, rejection_reason: null },
  { id: '4', client_id: 'CLI-KA-2026-CLI-000002', provider_type: 'Clinic', provider_name: 'Wellness Clinic', contact_name: 'Dr. Sanjay Mehta', mobile: '7654321098', email: 'sanjay@wellness.in', city: 'Mysuru', state_code: 'KA', status: 'approved', submitted_at: '2026-05-03T11:00:00Z', reviewed_at: '2026-05-04T09:30:00Z', rejection_reason: null },
  { id: '5', client_id: null, provider_type: 'Diagnostic Center', provider_name: 'SRL Diagnostics', contact_name: 'Meena Iyer', mobile: '6543210987', email: 'meena@srl.in', city: 'Mumbai', state_code: 'MH', status: 'rejected', submitted_at: '2026-05-05T16:45:00Z', reviewed_at: '2026-05-06T11:00:00Z', rejection_reason: 'License certificate unclear. Please resubmit.' },
  { id: '6', client_id: null, provider_type: 'Individual Doctor', provider_name: 'Dr. Anita Desai', contact_name: 'Dr. Anita Desai', mobile: '9988776655', email: 'anita@docmail.in', city: 'Pune', state_code: 'MH', status: 'pending', submitted_at: '2026-05-09T07:00:00Z', reviewed_at: null, rejection_reason: null },
  { id: '7', client_id: 'CLI-DL-2026-HOS-000003', provider_type: 'Hospital', provider_name: 'Max Super Speciality', contact_name: 'Vikram Singh', mobile: '9871234560', email: 'vikram@max.in', city: 'New Delhi', state_code: 'DL', status: 'approved', submitted_at: '2026-04-28T10:00:00Z', reviewed_at: '2026-04-29T14:00:00Z', rejection_reason: null },
  { id: '8', client_id: null, provider_type: 'Clinic', provider_name: 'Lifeline Clinic', contact_name: 'Dr. Hari Prasad', mobile: '8899001122', email: 'hari@lifeline.in', city: 'Hyderabad', state_code: 'TS', status: 'pending', submitted_at: '2026-05-09T06:30:00Z', reviewed_at: null, rejection_reason: null },
];
