import { renderHook } from '@testing-library/react';
import type { Options } from '../index';
import { createUseStorageState } from '../index';
import { act } from 'react';

class TestStorage implements Storage {
  [name: string]: any;

  length: number = 0;

  _values = new Map<string, string>();

  clear(): void {
    this._values.clear();
    this.length = 0;
  }

  getItem(key: string): string | null {
    return this._values.get(key) || null;
  }

  key(index: number): string | null {
    if (index >= this._values.size) {
      return null;
    }

    return Array.from(this._values.keys())[index];
  }

  removeItem(key: string): void {
    if (this._values.delete(key)) {
      this.length -= 1;
    }
  }

  setItem(key: string, value: string): void {
    if (!this._values.has(key)) {
      this.length += 1;
    }

    this._values.set(key, value);
  }
}

interface StorageStateProps<T> extends Pick<Options<T>, 'defaultValue'> {
  key: string;
}

describe('useStorageState', () => {
  const setUp = <T>(props: StorageStateProps<T>) => {
    const storage = new TestStorage();
    const useStorageState = createUseStorageState(() => storage);

    return renderHook(
      ({ key, defaultValue }: StorageStateProps<T>) => {
        const [state, setState] = useStorageState(key, { defaultValue });

        return { state, setState };
      },
      {
        initialProps: props,
      },
    );
  };

  it('should get defaultValue for a given key', () => {
    const hook = setUp({ key: 'key1', defaultValue: 'value1' });
    expect(hook.result.current.state).toBe('value1');

    hook.rerender({ key: 'key2', defaultValue: 'value2' });
    expect(hook.result.current.state).toBe('value2');
  });

  it('should get default and set value for a given key', () => {
    const hook = setUp({ key: 'key', defaultValue: 'defaultValue' });
    expect(hook.result.current.state).toBe('defaultValue');
    act(() => {
      hook.result.current.setState('setValue');
    });
    expect(hook.result.current.state).toBe('setValue');
    hook.rerender({ key: 'key' });
    expect(hook.result.current.state).toBe('setValue');
  });

  it('should remove value for a given key', () => {
    const hook = setUp({ key: 'key' });
    act(() => {
      hook.result.current.setState('value');
    });
    expect(hook.result.current.state).toBe('value');
    act(() => {
      hook.result.current.setState(undefined);
    });
    expect(hook.result.current.state).toBeUndefined();

    act(() => hook.result.current.setState('value'));
    expect(hook.result.current.state).toBe('value');
    act(() => hook.result.current.setState());
    expect(hook.result.current.state).toBeUndefined();
  });

  it('should support function updater with latest state', () => {
    const hook = setUp({ key: 'key', defaultValue: 'A' });

    act(() => {
      hook.result.current.setState('B');
    });

    act(() => {
      hook.result.current.setState((prev) => `${prev}-C`);
    });

    expect(hook.result.current.state).toBe('B-C');
  });

  it('should support custom serializer and deserializer', () => {
    const storage = new TestStorage();
    const useStorageState = createUseStorageState(() => storage);

    const hook = renderHook(() =>
      useStorageState<{ count: number }>('custom-key', {
        defaultValue: { count: 1 },
        serializer: (value: { count: number }) => String(value.count),
        deserializer: (value) => ({ count: Number(value) }),
      }),
    );

    act(() => {
      hook.result.current[1]({ count: 2 });
    });

    expect(storage.getItem('custom-key')).toBe('2');

    const anotherHook = renderHook(() =>
      useStorageState<{ count: number }>('custom-key', {
        serializer: (value: { count: number }) => String(value.count),
        deserializer: (value) => ({ count: Number(value) }),
      }),
    );

    expect(anotherHook.result.current[0]).toEqual({ count: 2 });
  });

  it('should fallback to function default value and use default onError when storage accessor fails', () => {
    const error = new Error('storage blocked');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const useStorageState = createUseStorageState(() => {
      throw error;
    });

    const hook = renderHook(() =>
      useStorageState('broken-key', {
        defaultValue: () => 'fallback',
      }),
    );

    expect(hook.result.current[0]).toBe('fallback');
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });

  it('should call custom onError when reading storage fails', () => {
    const error = new Error('read failed');
    const storage = new TestStorage();
    storage.getItem = jest.fn(() => {
      throw error;
    });
    const onError = jest.fn();
    const useStorageState = createUseStorageState(() => storage);

    const hook = renderHook(() =>
      useStorageState('broken-read-key', {
        defaultValue: () => 'safe-value',
        onError,
      }),
    );

    expect(hook.result.current[0]).toBe('safe-value');
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should log when writing to storage fails', () => {
    const error = new Error('quota exceeded');
    const storage = new TestStorage();
    storage.setItem = jest.fn(() => {
      throw error;
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const useStorageState = createUseStorageState(() => storage);
    const hook = renderHook(() => useStorageState('write-fail-key'));

    act(() => {
      hook.result.current[1]('value');
    });

    expect(hook.result.current[0]).toBe('value');
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });
});
