'use server';

import {auth, signIn} from '@/auth.config';
import {createSession} from '@/lib/session';
import {redirect} from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    const session = await auth();

    //TODO: create session and
    await createSession(session?.user.id as string);

    // Redirect to the previous page
    redirect('/');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return 'CredentialsSignin';
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', {email, password});

    const session = await auth();

    //TODO: create session and
    await createSession(session?.user.id as string);

    // Redirect to the previous page
    redirect('/');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo iniciar sesión',
    };
  }
};
