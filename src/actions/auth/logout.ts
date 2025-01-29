'use server';
import {signOut} from '@/auth.config';
import {deleteSession} from '@/lib/session';

import {redirect} from 'next/navigation';

export async function logout() {
  try {
    await signOut();
    await deleteSession();
    redirect('/');
  } catch (error) {
    console.error(error);
  }
}
