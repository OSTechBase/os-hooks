const getScrollParent = (node: HTMLElement) => {
  let parent: HTMLElement | null = node;
  while ((parent = parent.parentElement)) {
    const overflowYVal = getComputedStyle(parent, null).getPropertyValue('overflow-y');
    if (parent === document.body) return window;
    if (overflowYVal === 'auto' || overflowYVal === 'scroll' || overflowYVal === 'overlay') {
      return parent;
    }
  }
  return window;
};
export default getScrollParent;
