import { randomInt } from 'node:crypto';

export const is_set = (n: number, mask: number) => {
  return (n & mask) != 0;
};

export const random = () => {
  return randomInt(250);
};
