import { ValueOrFactory } from '@shared/util-types';

export const getValue = <TValue>(valueOrFactory: ValueOrFactory<TValue>): TValue => {
  return typeof valueOrFactory === 'function' ? (valueOrFactory as () => TValue)() : valueOrFactory;
};
