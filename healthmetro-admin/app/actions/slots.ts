'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getSlotConfiguration() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('slot_configuration')
    .select('*')
    .order('day_of_week')
    .order('slot_time');

  if (error) {
    console.error('Error fetching slot configuration:', error);
    return [];
  }

  return data;
}

export async function toggleSlotStatus(dayOfWeek: string, slotTime: string, isBlocked: boolean) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from('slot_configuration')
    .update({ is_blocked: isBlocked, updated_at: new Date().toISOString() })
    .match({ day_of_week: dayOfWeek, slot_time: slotTime });

  if (error) {
    console.error('Error updating slot status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/slots');
  return { success: true };
}
