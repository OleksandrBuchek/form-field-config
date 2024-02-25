import { isSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { isFactoryFunction } from '@shared/util-helpers';
import { ValueOrFactory, ValueOrReactive } from '@shared/util-types';
import { isObservable, of } from 'rxjs';

export const asObservable = <TValue>(valueOrFactory: ValueOrFactory<ValueOrReactive<TValue>>) => {
  const toObservableFn = (value: ValueOrReactive<TValue>) =>
    isObservable(value) ? value : isSignal(value) ? toObservable(value) : of(value);

  return isFactoryFunction(valueOrFactory) ? toObservableFn(valueOrFactory()) : toObservableFn(valueOrFactory);
};
