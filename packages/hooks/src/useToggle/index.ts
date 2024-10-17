import { useMemo, useState } from 'react';

// useToggle 切换
export interface Actions<T> {
  setLeft: () => void;
  setRight: () => void;
  set: (value: T) => void;
  toggle: () => void;
}
//                    入参类型       返回值类型
function useToggle<T = boolean>(): [boolean, Actions<T>]; //作为基础的true false的使用

function useToggle<T>(defaultValue: T): [T, Actions<T>];

function useToggle<T, U>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>];

function useToggle<D, R>(defaultValue: D = false as D, reverseValue?: R) {
  const [state, setState] = useState<D | R>(defaultValue);
  const actions = useMemo(() => {
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

    const toggle = () => setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue));
    const setLeft = () => setState(defaultValue);
    const setRight = () => setState(reverseValueOrigin);
    const set = (value: D | R) => setState(value);
    return {
      toggle,
      setLeft,
      setRight,
      set,
    };
  }, []);
  return [state, actions];
}
export default useToggle;
