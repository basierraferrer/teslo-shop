// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sanitizeAddressORder = (address: any) => {
  delete address.userId;
  delete address.id;
  return address;
};
