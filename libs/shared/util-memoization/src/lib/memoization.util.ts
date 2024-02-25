import { DestroyRef, inject } from '@angular/core';
import { objectEntries } from '@shared/util-object';

export interface MemoUntilDestroyedParams {
  destroyRef?: DestroyRef;
}

export const memoUntilDestroyed = <Fn extends () => any>(fn: Fn, params?: MemoUntilDestroyedParams) => {
  let destroyRef: DestroyRef | null;
  let cachedResult: ReturnType<Fn> | null;

  return (): ReturnType<Fn> => {
    if (!destroyRef) {
      destroyRef = params?.destroyRef ?? inject(DestroyRef);

      destroyRef.onDestroy(() => {
        destroyRef = null;
        cachedResult = null;
      });
    }

    if (cachedResult) {
      return cachedResult;
    } else {
      cachedResult = fn();
      return cachedResult!;
    }
  };
};

export interface MemoWithParamsUntilDestroyedParams<Fn extends (...args: any[]) => any>
  extends MemoUntilDestroyedParams {
  resolver: (...params: Parameters<Fn>) => string;
}

export const memoWithParamsUntilDestroyed = <Fn extends (...args: any[]) => any>(
  fn: Fn,
  params: MemoWithParamsUntilDestroyedParams<Fn>,
) => {
  let destroyRef: DestroyRef | null;
  let cacheMap: Map<string, ReturnType<Fn>> | null = null;

  return (...args: Parameters<Fn>): ReturnType<Fn> => {
    if (!destroyRef) {
      destroyRef = params.destroyRef ?? inject(DestroyRef);
      cacheMap = new Map();

      destroyRef.onDestroy(() => {
        destroyRef = null;
        cacheMap?.clear();
        cacheMap = null;
      });
    }

    const key = params.resolver(...args);

    if (cacheMap!.has(key)) {
      return cacheMap!.get(key)!;
    } else {
      cacheMap!.set(key, fn(...args));
      return cacheMap!.get(key)!;
    }
  };
};

export const groupMemoUntilDestroyed = <T extends Record<string, () => any>>(group: T): T =>
  objectEntries(group).reduce((acc, [key, fn]) => ({ ...acc, [key]: memoUntilDestroyed(fn) }), {} as T);
