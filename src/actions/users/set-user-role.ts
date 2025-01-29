'use server';

import {auth} from '@/auth.config';
import prisma from '@/lib/prisma';
import {Role} from '@prisma/client';
import {revalidatePath} from 'next/cache';

export const setUserRole = async (userId: string, role: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debe ser un usuario admin',
    };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role as Role,
    },
  });

  revalidatePath('/admin/users');

  return {
    ok: true,
  };
};
