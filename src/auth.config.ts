import NextAuth, {type NextAuthConfig} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import {z} from 'zod';

import prisma from './lib/prisma';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },

  callbacks: {
    async authorized({auth}) {
      if (auth && auth.user) {
        return true;
      }
      return false;
    },

    async jwt({token, user}) {
      if (user) {
        token.data = user;
      }

      return token;
    },

    async session({session, token}) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token.data as any;
      return session;
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({email: z.string().email(), password: z.string().min(6)})
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.error('Invalid credentials');
          return null;
        }

        const {email} = parsedCredentials.data;

        // Buscar el correo
        const user = await prisma.user.findUnique({
          where: {email: email.toLowerCase()},
        });
        if (!user) {
          console.error('No user found');
          return null;
        }

        // Comparar las contraseñas
        const isValidPassword = await bcryptjs.compare(
          parsedCredentials.data.password,
          user.password,
        );

        if (!isValidPassword) {
          console.error('Invalid password');
          return null;
        }

        // Regresar el usuario sin el password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {password, ...rest} = user;

        return rest;
      },
    }),
  ],
};

export const {signIn, signOut, auth, handlers} = NextAuth(authConfig);
