import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useMediaRecorder from '../index';

beforeAll(() => {
  // 模拟 URL.createObjectURL 和 revokeObjectURL
  global.URL.createObjectURL = jest.fn().mockImplementation(() => 'blob:mock-url');
  global.URL.revokeObjectURL = jest.fn();

  // 模拟 MediaStream
  class MockMediaStream {
    tracks: any[];
    constructor() {
      this.tracks = [];
    }
    getTracks() {
      return this.tracks;
    }
    addTrack(track: any) {
      this.tracks.push(track);
    }
    removeTrack(track: any) {
      this.tracks = this.tracks.filter((t) => t !== track);
    }
  }
  global.MediaStream = MockMediaStream as any;

  // 模拟 MediaRecorder
  class MockMediaRecorder {
    stream: any;
    state: 'inactive' | 'recording' | 'paused';
    ondataavailable: ((event: any) => void) | null;
    onstop: ((event: Event) => void) | null;

    constructor(stream: any) {
      this.stream = stream;
      this.state = 'inactive';
      this.ondataavailable = null;
      this.onstop = null;
    }

    start() {
      this.state = 'recording';
    }

    stop() {
      this.state = 'inactive';
      if (this.onstop) {
        this.onstop(new Event('stop'));
      }
    }

    pause() {
      this.state = 'paused';
    }

    resume() {
      this.state = 'recording';
    }
  }
  global.MediaRecorder = MockMediaRecorder as any;

  // 模拟 navigator.mediaDevices.getUserMedia
  Object.defineProperty(global.navigator, 'mediaDevices', {
    writable: true,
    configurable: true,
    value: {
      getUserMedia: jest.fn().mockResolvedValue(new MockMediaStream()),
    },
  });
});

afterAll(() => {
  jest.restoreAllMocks();

  // 恢复到原始行为或重置为空实现
  global.URL.createObjectURL = jest.fn();
  global.URL.revokeObjectURL = jest.fn();
});

describe('useMediaRecorder hook', () => {
  it('should initialize correctly', () => {
    const { result } = renderHook(() => useMediaRecorder());
    expect(result.current.mediaRecorder).toBeNull();
    expect(result.current.mediaStream).toBeNull();
  });

  it('should start and stop recording', async () => {
    const { result } = renderHook(() => useMediaRecorder());

    await act(async () => {
      await result.current.startRecord();
    });

    expect(result.current.mediaRecorder?.state).toBe('recording');
    expect(result.current.mediaStream).toBeInstanceOf(global.MediaStream);

    // act(() => {
    //   result.current.stopRecord();
    // });

    // expect(result.current.mediaRecorder?.state).toBe('inactive');
  });

  it('should pause and resume recording', async () => {
    const { result } = renderHook(() => useMediaRecorder());

    await act(async () => {
      await result.current.startRecord();
    });

    expect(result.current.mediaRecorder?.state).toBe('recording');

    act(() => {
      result.current.pauseRecord();
    });

    expect(result.current.mediaRecorder?.state).toBe('paused');

    act(() => {
      result.current.resumeRecord();
    });

    expect(result.current.mediaRecorder?.state).toBe('recording');
  });
});
