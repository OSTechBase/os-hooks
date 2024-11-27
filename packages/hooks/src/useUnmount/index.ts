import { useEffect, useRef } from 'react';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

const useUnmount = (fn: () => void) => {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useUnmount 预期参数是一个函数，得到 ${typeof fn}`);
    }
  }

  const fnRef = useRef(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    [],
  );
};

export default useUnmount;
