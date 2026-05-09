import { act } from 'react';
import { TextDecoder } from 'util';
import { renderHook } from '@testing-library/react';
import useStream from '../index';

function createReader(chunks: string[]) {
  let index = 0;

  return {
    read: jest.fn(async () => {
      if (index >= chunks.length) {
        return { done: true, value: undefined };
      }

      const value = Uint8Array.from(chunks[index].split('').map((char) => char.charCodeAt(0)));
      index += 1;
      return { done: false, value };
    }),
  };
}

describe('useStream', () => {
  const originalFetch = global.fetch;
  const originalTextDecoder = global.TextDecoder;

  beforeAll(() => {
    (global as any).TextDecoder = TextDecoder;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  afterAll(() => {
    (global as any).TextDecoder = originalTextDecoder;
  });

  it('should append streamed reply content in normal mode', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      body: {
        getReader: () => createReader(['hel', 'lo']),
      },
    } as unknown as Response);

    const hook = renderHook(() =>
      useStream('/api/stream', {
        formatResult: (res) => res,
      }),
    );

    await act(async () => {
      await hook.result.current.run({ id: 1 }, { type: 'question', content: 'hi' });
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/stream', {
      method: 'POST',
      body: JSON.stringify({ id: 1 }),
    });
    expect(hook.result.current.messageList).toEqual([
      { type: 'question', content: 'hi' },
      expect.objectContaining({
        type: 'reply',
        response: 'hello',
      }),
    ]);
  });

  it('should support customize mode', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      body: {
        getReader: () => createReader(['chunk']),
      },
    } as unknown as Response);

    const hook = renderHook(() =>
      useStream('/api/stream', {
        customize: true,
        formatResult: (res, update) => {
          update((history: any[]) => [
            ...history,
            {
              type: 'reply',
              response: res.toUpperCase(),
            },
          ]);
        },
      }),
    );

    await act(async () => {
      await hook.result.current.run({ id: 2 }, { type: 'question', content: 'custom' });
    });

    expect(hook.result.current.messageList).toEqual([
      { type: 'question', content: 'custom' },
      {
        type: 'reply',
        response: 'CHUNK',
      },
    ]);
  });
});
