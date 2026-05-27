'use server';

// Disable TLS validation to allow fetching from servers with expired SSL certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

interface PincodeResult {
  success: boolean;
  state?: string;
  city?: string;
}

export async function fetchLocationByPincode(pincode: string): Promise<PincodeResult> {
  console.log(`[ServerAction] Resolving PIN code: ${pincode}`);

  // 1. Try Zippopotam.us first (fast and reliable)
  try {
    const response = await fetch(`https://api.zippopotam.us/IN/${pincode}`, { signal: AbortSignal.timeout(4000) });
    if (response.ok) {
      const data = await response.json();
      if (data && data.places && data.places.length > 0) {
        const info = data.places[0];
        console.log(`[ServerAction] Zippopotam.us resolved PIN ${pincode} -> State: ${info.state}, City: ${info['place name']}`);
        return {
          success: true,
          state: info.state,
          city: info['place name'] || info['place_name'],
        };
      }
    }
  } catch (err) {
    console.error(`[ServerAction] Zippopotam fetch error:`, err);
  }

  // 2. Try PostalPincode.in (SSL validation is ignored globally by NODE_TLS_REJECT_UNAUTHORIZED='0')
  try {
    console.log(`[ServerAction] Trying PostalPincode.in API...`);
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, { signal: AbortSignal.timeout(6000) });
    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && data[0].Status === 'Success') {
        const postOffices = data[0].PostOffice;
        if (postOffices && postOffices.length > 0) {
          const info = postOffices[0];
          console.log(`[ServerAction] PostalPincode.in resolved PIN ${pincode} -> State: ${info.State}, City: ${info.District}`);
          return {
            success: true,
            state: info.State,
            city: info.District || info.Block || info.Name,
          };
        }
      }
    }
  } catch (err) {
    console.error(`[ServerAction] PostalPincode.in fetch error:`, err);
  }

  // 3. Try HTTP fallback for PostalPincode.in
  try {
    console.log(`[ServerAction] Trying PostalPincode.in HTTP fallback...`);
    const response = await fetch(`http://api.postalpincode.in/pincode/${pincode}`, { signal: AbortSignal.timeout(6000) });
    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && data[0].Status === 'Success') {
        const postOffices = data[0].PostOffice;
        if (postOffices && postOffices.length > 0) {
          const info = postOffices[0];
          console.log(`[ServerAction] PostalPincode.in HTTP resolved PIN ${pincode} -> State: ${info.State}, City: ${info.District}`);
          return {
            success: true,
            state: info.State,
            city: info.District || info.Block || info.Name,
          };
        }
      }
    }
  } catch (err) {
    console.error(`[ServerAction] PostalPincode.in HTTP fallback error:`, err);
  }

  console.warn(`[ServerAction] Failed to resolve PIN: ${pincode}`);
  return { success: false };
}
