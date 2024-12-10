import React from 'react';
import { useStickyBox } from 'os-hooks';
const NestedScrollContainer = () => {
  const [setNode, stickyState] = useStickyBox({ offsetTop: 0 });

  return (
    <div
      style={{
        overflowY: 'auto',
        maxHeight: '300px',
        border: '1px solid #ccc',
        padding: '20px',
        margin: '20px'
      }}
    >
      <div style={{ height: '100px' }}>Header</div>
      <div ref={setNode} style={{ background: 'lightgreen', padding: '10px' }}>
        {stickyState.isStickyTop ? '容器内部吸顶!' : '在容器内向下滚动'}
      </div>
      <div style={{ height: '800px' }}>Scroll me!</div>
    </div>
  );
};

export default NestedScrollContainer;
