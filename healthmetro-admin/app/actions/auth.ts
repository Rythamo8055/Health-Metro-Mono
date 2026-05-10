'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD || 'HealthMetro@2026';

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    return { success: true };
  }

  return { success: false, error: 'Invalid password' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/login');
}
