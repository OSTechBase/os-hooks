import { act } from 'react';
import { renderHook } from '@testing-library/react';
import useModalFn from '../index';
import openModal from '../components/openModal';
import openModalForm from '../components/openModalForm';

jest.mock('../components/openModal', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../components/openModalForm', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useModalFn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use dom modal by default', () => {
    const hook = renderHook(() => useModalFn());
    const config = {
      title: 'Default Modal',
      children: 'content',
    };

    act(() => {
      hook.result.current(config as any);
    });

    expect(openModal).toHaveBeenCalledTimes(1);
    expect(openModal).toHaveBeenCalledWith(config);
    expect(openModalForm).not.toHaveBeenCalled();
  });

  it('should use dom modal when type is dom', () => {
    const hook = renderHook(() => useModalFn('dom'));
    const config = {
      title: 'DOM Modal',
    };

    act(() => {
      hook.result.current(config as any);
    });

    expect(openModal).toHaveBeenCalledTimes(1);
    expect(openModal).toHaveBeenCalledWith(config);
    expect(openModalForm).not.toHaveBeenCalled();
  });

  it('should use modal form when type is form', () => {
    const hook = renderHook(() => useModalFn<{ name: string }>('form'));
    const config = {
      title: 'Form Modal',
      columns: [{ title: 'Name', dataIndex: 'name' }],
    };

    act(() => {
      hook.result.current(config as any);
    });

    expect(openModalForm).toHaveBeenCalledTimes(1);
    expect(openModalForm).toHaveBeenCalledWith(config);
    expect(openModal).not.toHaveBeenCalled();
  });

  it('should switch dispatcher when type changes after rerender', () => {
    const hook = renderHook(({ type }) => useModalFn(type as any), {
      initialProps: { type: 'dom' as 'dom' | 'form' },
    });

    act(() => {
      hook.result.current({ title: 'First' } as any);
    });

    expect(openModal).toHaveBeenCalledTimes(1);
    expect(openModalForm).not.toHaveBeenCalled();

    hook.rerender({ type: 'form' });

    act(() => {
      hook.result.current({ title: 'Second' } as any);
    });

    expect(openModalForm).toHaveBeenCalledTimes(1);
  });
});
