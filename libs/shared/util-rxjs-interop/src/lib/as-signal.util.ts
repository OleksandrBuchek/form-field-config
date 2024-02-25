import { Signal, isSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { isFactoryFunction } from '@shared/util-helpers';
import { ValueOrFactory, ValueOrReactive } from '@shared/util-types';
import { isObservable } from 'rxjs';

export function asSignal<TValue>(valueOrFactory: ValueOrFactory<ValueOrReactive<TValue>>): Signal<TValue | undefined>;
export function asSignal<TValue>(
  valueOrFactory: ValueOrFactory<ValueOrReactive<TValue>>,
  params?: { initialValue: TValue },
): Signal<TValue>;
export function asSignal<TValue>(
  valueOrFactory: ValueOrFactory<ValueOrReactive<TValue>>,
  params?: { requireSync: true },
): Signal<TValue>;
export function asSignal<TValue>(
  valueOrFactory: ValueOrFactory<ValueOrReactive<TValue>>,
  params?: { initialValue: TValue } | { requireSync: true },
): Signal<TValue> | Signal<TValue | undefined> {
  const toSignalFn = (value: ValueOrReactive<TValue>) =>
    isSignal(value) ? value : isObservable(value) ? toSignal(value, params as any) : signal(value);

  return isFactoryFunction(valueOrFactory) ? toSignalFn(valueOrFactory()) : toSignalFn(valueOrFactory);
}
