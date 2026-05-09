'use client';

import { useSearchParams } from 'next/navigation';

/**
 * useReferral — reads URL parameters for tracking
 *
 * For provider forms:   ?ref=DR-XXXXXXXX        → referrerId
 * For customer form:    ?client_id=CLI-TN-2026-HOS-000145 → clientId
 */
export function useReferral() {
  const searchParams = useSearchParams();

  const referrerId = searchParams.get('ref') ?? '';
  const clientId = searchParams.get('client_id') ?? '';

  // Determine referral source for analytics
  const referralSource = clientId
    ? searchParams.get('src') === 'qr'
      ? 'QR_SCAN'
      : 'LINK'
    : '';

  return { referrerId, clientId, referralSource };
}
