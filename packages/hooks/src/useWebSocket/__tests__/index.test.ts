import { act } from 'react';
import { renderHook } from '@testing-library/react';
import useWebSocket, { ReadyState } from '../index';

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  readyState = ReadyState.Connecting;
  onopen?: (event: Event) => void;
  onclose?: (event: CloseEvent) => void;
  onmessage?: (event: MessageEvent) => void;
  onerror?: (event: Event) => void;
  send = jest.fn();
  close = jest.fn(() => {
    this.readyState = ReadyState.Closed;
    this.onclose?.({ type: 'close' } as CloseEvent);
  });

  constructor(
    public url: string,
    public protocols?: string | string[],
  ) {
    MockWebSocket.instances.push(this);
  }

  emitOpen() {
    this.readyState = ReadyState.Open;
    this.onopen?.({ type: 'open' } as Event);
  }

  emitMessage(data: string) {
    this.onmessage?.({ data } as MessageEvent);
  }

  emitError() {
    this.readyState = ReadyState.Closed;
    this.onerror?.({ type: 'error' } as Event);
  }
}

describe('useWebSocket', () => {
  const originalWebSocket = global.WebSocket;

  beforeAll(() => {
    (global as any).WebSocket = MockWebSocket;
    jest.useFakeTimers();
  });

  afterAll(() => {
    (global as any).WebSocket = originalWebSocket;
    jest.useRealTimers();
  });

  beforeEach(() => {
    MockWebSocket.instances = [];
    jest.clearAllMocks();
  });

  it('should auto connect and receive messages', () => {
    const onOpen = jest.fn();
    const onMessage = jest.fn();

    const hook = renderHook(() =>
      useWebSocket('ws://localhost:1234', {
        onOpen,
        onMessage,
      }),
    );

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(hook.result.current.readyState).toBe(ReadyState.Connecting);

    act(() => {
      MockWebSocket.instances[0].emitOpen();
    });

    expect(hook.result.current.readyState).toBe(ReadyState.Open);
    expect(onOpen).toHaveBeenCalled();

    act(() => {
      MockWebSocket.instances[0].emitMessage('hello');
    });

    expect(hook.result.current.latestMessage?.data).toBe('hello');
    expect(onMessage).toHaveBeenCalled();

    act(() => {
      hook.result.current.sendMessage('outbound');
    });

    expect(MockWebSocket.instances[0].send).toHaveBeenCalledWith('outbound');
  });

  it('should not connect automatically in manual mode', () => {
    const hook = renderHook(() =>
      useWebSocket('ws://localhost:1234', {
        manual: true,
      }),
    );

    expect(MockWebSocket.instances).toHaveLength(0);

    act(() => {
      hook.result.current.connect();
    });

    expect(MockWebSocket.instances).toHaveLength(1);
  });

  it('should throw when sending message before socket opens', () => {
    const hook = renderHook(() => useWebSocket('ws://localhost:1234'));

    expect(() => {
      hook.result.current.sendMessage('fail');
    }).toThrow('WebSocket disconnected');
  });

  it('should reconnect on error within reconnect limit', () => {
    const onError = jest.fn();
    renderHook(() =>
      useWebSocket('ws://localhost:1234', {
        reconnectInterval: 1000,
        reconnectLimit: 2,
        onError,
      }),
    );

    expect(MockWebSocket.instances).toHaveLength(1);

    act(() => {
      MockWebSocket.instances[0].emitError();
    });

    expect(onError).toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(MockWebSocket.instances).toHaveLength(2);
  });

  it('should stop reconnecting after disconnect', () => {
    const hook = renderHook(() =>
      useWebSocket('ws://localhost:1234', {
        reconnectInterval: 1000,
        reconnectLimit: 2,
      }),
    );

    expect(MockWebSocket.instances).toHaveLength(1);

    act(() => {
      hook.result.current.disconnect();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(hook.result.current.readyState).toBe(ReadyState.Closed);
  });

  it('should ignore stale events from previous websocket instances', () => {
    const onOpen = jest.fn();
    const onMessage = jest.fn();
    const onError = jest.fn();
    const hook = renderHook(() =>
      useWebSocket('ws://localhost:1234', {
        manual: true,
        onOpen,
        onMessage,
        onError,
      }),
    );

    act(() => {
      hook.result.current.connect();
    });

    const firstSocket = MockWebSocket.instances[0];

    act(() => {
      hook.result.current.connect();
    });

    const secondSocket = MockWebSocket.instances[1];

    act(() => {
      firstSocket.emitOpen();
      firstSocket.emitMessage('stale');
      firstSocket.emitError();
    });

    expect(hook.result.current.latestMessage).toBeUndefined();
    expect(hook.result.current.readyState).toBe(ReadyState.Connecting);
    expect(onOpen).not.toHaveBeenCalled();
    expect(onMessage).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();

    act(() => {
      secondSocket.emitOpen();
      secondSocket.emitMessage('fresh');
    });

    expect(hook.result.current.latestMessage?.data).toBe('fresh');
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledTimes(1);
  });
});
