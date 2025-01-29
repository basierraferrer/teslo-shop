'use client';
import {authenticate} from '@/actions';
import clsx from 'clsx';
import Link from 'next/link';
import React, {useActionState} from 'react';
import {IoInformationCircle} from 'react-icons/io5';

export const LoginForm = () => {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  return (
    <form action={formAction} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        name="email"
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
      />

      <label htmlFor="email">Contraseña</label>
      <input
        name="password"
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
      />

      <button
        type="submit"
        className={clsx({
          'btn-primary': !isPending,
          'btn-disabled': isPending,
        })}
        disabled={isPending}>
        Ingresar
      </button>

      {errorMessage && (
        <div className="m-4 flex flex-row justify-center">
          <IoInformationCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-500 mr-4">{errorMessage}</p>
        </div>
      )}

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};
