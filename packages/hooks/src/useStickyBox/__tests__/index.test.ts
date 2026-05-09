import { act } from 'react';
import { renderHook } from '@testing-library/react';
import useStickyBox from '../index';

describe('useStickyBox', () => {
  it('should apply sticky styles and calculate sticky state inside scroll container', () => {
    const parent = document.createElement('div');
    parent.style.overflowY = 'auto';
    parent.style.borderTopWidth = '2px';
    parent.style.borderBottomWidth = '2px';
    parent.style.paddingTop = '4px';
    parent.style.paddingBottom = '4px';

    const node = document.createElement('div');
    parent.appendChild(node);
    document.body.appendChild(parent);

    jest.spyOn(parent, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 300,
    } as DOMRect);
    jest.spyOn(node, 'getBoundingClientRect').mockReturnValue({
      top: 110,
      bottom: 293,
    } as DOMRect);

    const hook = renderHook(() =>
      useStickyBox({
        offsetTop: 4,
        offsetBottom: 0,
      }),
    );

    act(() => {
      hook.result.current[0](node);
    });

    expect(node.style.position).toBe('sticky');
    expect(node.style.top).toBe('4px');
    expect(hook.result.current[1]).toEqual({
      isStickyTop: true,
      isStickyBottom: false,
    });

    document.body.removeChild(parent);
  });
});
