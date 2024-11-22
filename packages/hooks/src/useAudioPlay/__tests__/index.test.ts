import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useAudioPlay from '../index';

describe('useAudioPlay hook', () => {
  let audioMock: Partial<HTMLAudioElement>;

  beforeEach(() => {
    // Mock HTMLAudioElement methods
    audioMock = {
      play: jest.fn(() => Promise.resolve()),
      pause: jest.fn(),
      onended: null,
      src: '',
      currentTime: 0,
    };
    global.Audio = jest.fn(() => audioMock as HTMLAudioElement);

    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useAudioPlay());

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.src).toBe('');
    expect(result.current.audio).toBe(audioMock);
  });

  it('should set the audio source', () => {
    const { result } = renderHook(() => useAudioPlay());

    act(() => {
      result.current.setSrc('test-audio.mp3');
    });

    expect(result.current.src).toBe('test-audio.mp3');
    expect(audioMock.src).toBe('test-audio.mp3');
  });

  it('should play the audio and update isPlaying', async () => {
    const { result } = renderHook(() => useAudioPlay());

    act(() => {
      result.current.setSrc('test-audio.mp3');
    });

    await act(async () => {
      await result.current.play();
    });

    expect(audioMock.play).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(true);
  });

  it('should warn if play is called without setting src', async () => {
    const { result } = renderHook(() => useAudioPlay());

    await act(async () => {
      result.current.play();
    });

    expect(console.warn).toHaveBeenCalledWith('No audio source set');
    expect(audioMock.play).not.toHaveBeenCalled();
  });

  it('should pause the audio and update isPlaying', () => {
    const { result } = renderHook(() => useAudioPlay());

    act(() => {
      result.current.setSrc('test-audio.mp3');
      result.current.play();
      result.current.pause();
    });

    expect(audioMock.pause).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it('should replay the audio from the beginning', async () => {
    const { result } = renderHook(() => useAudioPlay());

    act(() => {
      result.current.setSrc('test-audio.mp3');
    });

    await act(async () => {
      await result.current.replay();
    });

    expect(audioMock.currentTime).toBe(0);
    expect(audioMock.play).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(true);
  });

  it('should stop playing and reset isPlaying when audio ends', () => {
    const { result } = renderHook(() => useAudioPlay());

    act(() => {
      result.current.setSrc('test-audio.mp3');
      result.current.play();
    });

    expect(audioMock.pause).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });
});
