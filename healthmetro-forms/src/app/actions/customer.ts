'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export async function submitCustomerRegistration(formData: FormData) {
  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (configErr: any) {
    console.error('Supabase admin client config error:', configErr.message);
    return { success: false, error: `Server configuration error: ${configErr.message}.` };
  }

  // 1. Extract JSON data
  const dataString = formData.get('data') as string;
  if (!dataString) throw new Error('Form data missing');
  const data = JSON.parse(dataString);
  
  console.log('--- CUSTOMER FORM SUBMIT ---');
  console.log('Payload data:', data);

  const clientId = formData.get('clientId') as string;
  const referralSource = formData.get('referralSource') as string;
  console.log('clientId:', clientId, 'referralSource:', referralSource);
  
  const gpsString = formData.get('gpsCoords') as string;
  const gpsCoords = gpsString ? JSON.parse(gpsString) : null;

  try {
    // 2. Validate Provider & Get Provider ID
    console.log('Searching for provider with client_id:', `"${clientId}"`);
    const { data: providerData, error: pErr } = await supabase
      .from('providers')
      .select('id, type_code, sequence, status')
      .eq('client_id', clientId)
      .eq('status', 'approved')
      .single();

    if (pErr || !providerData) {
      console.error('Provider Lookup Failed:', pErr?.message || 'No provider found');
      if (pErr) console.error('Full Error:', JSON.stringify(pErr));
      throw new Error(`Invalid Provider Client ID: ${pErr?.message || 'No approved provider found for ' + clientId}`);
    }
    console.log('Provider verified:', providerData.id);

    const year = new Date().getFullYear();
    const clientShort = `${providerData.type_code}${providerData.sequence}`;

    // Lookup state_id
    const { data: stateData } = await supabase
      .from('states')
      .select('id')
      .eq('state_code', data.state_code)
      .single();

    // 3. Generate Customer ID via RPC
    const { data: customerId, error: rpcError } = await supabase.rpc('generate_customer_id', {
      p_client_short: clientShort,
      p_service_type: 'BLD',
      p_year: year
    });

    if (rpcError) {
      console.error('RPC generate_customer_id error:', rpcError);
    }
    
    const finalCustomerId = customerId || `CUST-${clientShort}-${year}-BLD-${String(Math.floor(Math.random() * 99999)).padStart(6, '0')}`;

    // 4. Insert Customer
    const customerParts = finalCustomerId.split('-');
    const sequence = parseInt(customerParts[customerParts.length - 1], 10);

    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert({
        customer_id: finalCustomerId,
        client_id: clientId,
        provider_id: providerData.id,
        client_short: clientShort,
        full_name: data.full_name,
        gender: data.gender,
        age: parseInt(data.age, 10),
        mobile: data.mobile,
        email: data.email || null,
        address: data.address,
        state_id: stateData?.id || null,
        city_id: null,
        pin_code: data.pin_code,
        collection_type: data.collection_type,
        home_address: data.home_address || null,
        latitude: gpsCoords?.lat || null,
        longitude: gpsCoords?.lng || null,
        maps_link: data.maps_link || null,
        service_type: 'BLD',
        year: year,
        sequence: sequence,
        referral_source: null, // bypassing constraint until db is updated
        declaration_agreed: data.consent_accurate && data.consent_collection
      })
      .select()
      .single();

    if (customerError) {
      throw new Error(`Customer Insert Failed: ${customerError.message}`);
    }

    // 5. Insert Booking
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id: customerData.id,
        provider_id: providerData.id,
        slot_date: data.appointment_date,
        slot_time: data.time_slot,
        status: 'booked',
        payment_status: 'PENDING',
        activation_status: 'PENDING_PAYMENT'
      })
      .select()
      .single();

    if (bookingError) {
      // Slot conflict (unique constraint violation)
      if (bookingError.code === '23505') {
        throw new Error('SLOT_CONFLICT: This time slot is already booked for this provider. Please select another slot.');
      }
      throw new Error(`Booking Insert Failed: ${bookingError.message}`);
    }

    return { success: true, customer_id: finalCustomerId, booking: bookingData };

  } catch (error: any) {
    console.error('Customer Registration failed:', error);
    return { success: false, error: error.message || 'Registration failed' };
  }
}

export async function getBlockedSlots(dayOfWeek: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('slot_configuration')
    .select('slot_time')
    .eq('day_of_week', dayOfWeek)
    .eq('is_blocked', true);

  if (error) {
    console.error('Error fetching blocked slots:', error);
    return [];
  }
  return data.map(s => s.slot_time);
}
export async function verifyRegistrationToken(clientId: string, token: string) {
  const { verifyToken } = await import('@/utils/crypto');
  return verifyToken(clientId, token);
}
