import Cookies from 'js-cookie';
import { useCallback, useState } from 'react';
import { isFunction, isString } from '../utils';

export type State = string | undefined;

export interface Options extends Cookies.CookieAttributes {
  defaultValue?: State | (() => State);
}

function useCookieState(cookieKey: string, options: Options = {}) {
  const [state, setState] = useState<State>(() => {
    const cookieValue = Cookies.get(cookieKey);

    if (isString(cookieValue)) return cookieValue;

    if (isFunction(options.defaultValue)) {
      return options.defaultValue();
    }

    return options.defaultValue;
  });

  const updateState = useCallback(
    (
      newValue: State | ((prevState: State) => State),
      newOptions: Cookies.CookieAttributes = {},
    ) => {
      const { defaultValue, ...restOptions } = { ...options, ...newOptions };
      const value = isFunction(newValue) ? newValue(state) : newValue;

      setState(value);

      if (value === undefined) {
        Cookies.remove(cookieKey);
      } else {
        Cookies.set(cookieKey, value, restOptions);
      }
    },
    [],
  );

  return [state, updateState] as const;
}

export default useCookieState;
