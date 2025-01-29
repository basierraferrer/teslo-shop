'use client'
import { User } from '@/interfaces'
import React from 'react'
import { Role } from '../../../../../interfaces/user.interface';
import { setUserRole } from '@/actions/users/set-user-role';

interface Props {
  users: User[]
}

export const UserTable = ({ users }: Props) => {
  return (
    <table className="min-w-full border">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Email
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Nombre completo
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Role
          </th>
        </tr>
      </thead>
      <tbody>
        {
          users.map(user => (
            <tr key={user.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.email}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {user.name}
              </td>
              <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                <select
                  className='text-sm text-gray-900 w-full p-2 bg-transparent cursor-pointer capitalize'
                  value={user.role}
                  onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => setUserRole(user.id, evt.target.value)}>
                  <option className='capitalize' value={Role.ADMIN}>{Role.ADMIN}</option>
                  <option className='capitalize' value={Role.USER}>{Role.USER}</option>
                </select>
              </td>
            </tr>
          ))
        }


      </tbody >
    </table >
  )
}
