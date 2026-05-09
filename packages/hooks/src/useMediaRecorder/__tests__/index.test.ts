import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useMediaRecorder from '../index';

class MockTrack {
  stop = jest.fn();
}

class MockMediaStream {
  tracks: MockTrack[];

  constructor(tracks: MockTrack[] = [new MockTrack()]) {
    this.tracks = tracks;
  }

  getTracks() {
    return this.tracks;
  }

  addTrack(track: MockTrack) {
    this.tracks.push(track);
  }

  removeTrack(track: MockTrack) {
    this.tracks = this.tracks.filter((item) => item !== track);
  }
}

class MockMediaRecorder {
  static instances: MockMediaRecorder[] = [];

  stream: MockMediaStream;
  state: 'inactive' | 'recording' | 'paused' = 'inactive';
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: ((event: Event) => void | Promise<void>) | null = null;
  onerror: ((event: { error: Error }) => void) | null = null;
  start = jest.fn((timeslice?: number) => {
    this.state = 'recording';
    return timeslice;
  });
  stop = jest.fn(() => {
    if (this.state === 'inactive') {
      throw new Error('Recorder inactive');
    }

    this.state = 'inactive';
    this.onstop?.(new Event('stop'));
  });
  pause = jest.fn(() => {
    if (this.state !== 'recording') {
      throw new Error('Cannot pause recorder');
    }

    this.state = 'paused';
  });
  resume = jest.fn(() => {
    if (this.state !== 'paused') {
      throw new Error('Cannot resume recorder');
    }

    this.state = 'recording';
  });

  constructor(stream: MockMediaStream) {
    this.stream = stream;
    MockMediaRecorder.instances.push(this);
  }

  emitData(data: Blob) {
    this.ondataavailable?.({ data });
  }

  emitError(error: Error) {
    this.onerror?.({ error });
  }
}

beforeAll(() => {
  // 模拟 URL.createObjectURL 和 revokeObjectURL
  global.URL.createObjectURL = jest.fn().mockImplementation(() => 'blob:mock-url');
  global.URL.revokeObjectURL = jest.fn();

  // 模拟 MediaStream
  global.MediaStream = MockMediaStream as any;

  // 模拟 MediaRecorder
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
  beforeEach(() => {
    MockMediaRecorder.instances = [];
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue(new MockMediaStream());
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useMediaRecorder());
    expect(result.current.mediaRecorder).toBeNull();
    expect(result.current.mediaStream).toBeNull();
    expect(result.current.mediaUrl).toBe('');
    expect(result.current.blobData).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should start and stop recording with chunks', async () => {
    const { result } = renderHook(() => useMediaRecorder());
    const onChunk = jest.fn();

    await act(async () => {
      await result.current.startRecord(500, onChunk);
    });

    const recorder = MockMediaRecorder.instances[0];
    const stream = result.current.mediaStream as unknown as MockMediaStream;
    const track = stream.getTracks()[0];
    const firstChunk = new Blob(['hello '], { type: 'audio/wav' });
    const secondChunk = new Blob(['world'], { type: 'audio/wav' });

    expect(recorder.start).toHaveBeenCalledWith(500);
    expect(result.current.mediaRecorder?.state).toBe('recording');
    expect(result.current.mediaStream).toBeInstanceOf(global.MediaStream);

    act(() => {
      recorder.emitData(firstChunk);
      recorder.emitData(secondChunk);
    });

    expect(onChunk).toHaveBeenNthCalledWith(1, firstChunk);
    expect(onChunk).toHaveBeenNthCalledWith(2, secondChunk);

    await act(async () => {
      result.current.stopRecord();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(track.stop).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(result.current.mediaUrl).toBe('blob:mock-url');
    expect(result.current.blobData).toBeInstanceOf(Blob);
    expect(result.current.blobData?.size).toBe(firstChunk.size + secondChunk.size);
    expect(result.current.blobData?.type).toBe('audio/wav');
    expect(result.current.mediaStream).toBeNull();
    expect(result.current.mediaRecorder).toBeNull();
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

  it('should cleanup immediately when stop is called on an inactive recorder', async () => {
    const { result } = renderHook(() => useMediaRecorder());

    await act(async () => {
      await result.current.startRecord();
    });

    const recorder = MockMediaRecorder.instances[0];
    const stream = result.current.mediaStream as unknown as MockMediaStream;
    const track = stream.getTracks()[0];

    recorder.state = 'inactive';

    act(() => {
      result.current.stopRecord();
    });

    expect(track.stop).toHaveBeenCalled();
    expect(result.current.mediaStream).toBeNull();
    expect(result.current.mediaRecorder).toBeNull();
  });

  it('should set error when getUserMedia fails', async () => {
    const error = new Error('permission denied');
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValueOnce(error);
    const { result } = renderHook(() => useMediaRecorder());

    await act(async () => {
      await result.current.startRecord();
    });

    expect(result.current.error).toBe(error);
    expect(console.error).toHaveBeenCalledWith('Failed to start recording:', error);
  });

  it('should set error when recorder emits an error event', async () => {
    const { result } = renderHook(() => useMediaRecorder());

    await act(async () => {
      await result.current.startRecord();
    });

    const recorder = MockMediaRecorder.instances[0];
    const error = new Error('chunk failed');

    act(() => {
      recorder.emitError(error);
    });

    expect(result.current.error).toBe(error);
    expect(console.error).toHaveBeenCalledWith('Recording error:', error);
  });

  it('should reset state and cleanup active recording', async () => {
    const { result } = renderHook(() => useMediaRecorder());

    await act(async () => {
      await result.current.startRecord();
    });

    const recorder = MockMediaRecorder.instances[0];
    const stream = result.current.mediaStream as unknown as MockMediaStream;
    const track = stream.getTracks()[0];

    act(() => {
      recorder.emitError(new Error('temporary'));
    });

    act(() => {
      result.current.reset();
    });

    expect(track.stop).toHaveBeenCalled();
    expect(result.current.mediaUrl).toBe('');
    expect(result.current.blobData).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.mediaStream).toBeNull();
    expect(result.current.mediaRecorder).toBeNull();
  });

  it('should cleanup media resources on unmount', async () => {
    const { result, unmount } = renderHook(() => useMediaRecorder());

    await act(async () => {
      await result.current.startRecord();
    });

    const recorder = MockMediaRecorder.instances[0];
    const stream = result.current.mediaStream as unknown as MockMediaStream;
    const track = stream.getTracks()[0];

    act(() => {
      unmount();
    });

    expect(track.stop).toHaveBeenCalled();
    expect(recorder.stop).toHaveBeenCalled();
  });
});
