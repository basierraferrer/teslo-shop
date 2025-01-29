import {Address} from '@/interfaces';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface State {
  address: Address;
  setAddress: (address: State['address']) => void;
}

export const useAddressStore = create<State>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, _) => ({
      address: {
        firstName: '',
        lastName: '',
        address: '',
        postalCode: '',
        city: '',
        country: '',
        phone: '',
      },
      setAddress: address => {
        set({address});
      },
    }),
    {
      name: 'address-store',
    },
  ),
);
