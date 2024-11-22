import { throttle } from 'lodash-es';
import { useMemo, useRef } from 'react';
import type { ThrottleOptions } from './throttleOptions';
import useUnmount from '../useUnmount';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

type noop = (...args: any[]) => any;
function useThrottleFn<T extends noop>(
  fn: T,
  options?: ThrottleOptions,
): {
  run: ReturnType<typeof throttle>;
  cancel: () => void;
  flush: () => ReturnType<T>;
} {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useThrottleFn expected parameter is a function, got ${typeof fn}`);
    }
  }

  const fnRef = useRef(fn);

  const wait = options?.wait ?? 1000;

  const throttled = useMemo(
    () =>
      throttle(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args);
        },
        wait,
        options,
      ),
    [],
  );

  useUnmount(() => {
    throttled.cancel();
  });

  return {
    run: throttled,
    cancel: throttled.cancel,
    flush: throttled.flush,
  };
}

export default useThrottleFn;
