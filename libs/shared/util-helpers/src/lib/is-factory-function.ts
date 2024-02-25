import { isSignal } from '@angular/core';

export const isFactoryFunction = <TFactoryFn extends (...args: any[]) => any>(
  valueOrFactory: ReturnType<TFactoryFn> | TFactoryFn,
): valueOrFactory is TFactoryFn => typeof valueOrFactory === 'function' && !isSignal(valueOrFactory);
