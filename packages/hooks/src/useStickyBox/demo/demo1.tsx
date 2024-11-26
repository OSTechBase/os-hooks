import React from 'react';
import { useStickyBox } from 'os-hooks';

const StickyComponent = () => {
  const [setNode, stickyState] = useStickyBox({ offsetTop: 100 });

  return (
    <div>
      <div
        ref={setNode}
        style={{
          backgroundColor: stickyState.isStickyTop ? 'lightblue' : 'transparent',
          padding: '10px',
          textAlign: 'center'
        }}
      >
        {stickyState.isStickyTop ? '吸顶' : '未吸顶'}
      </div>
      <div style={{ height: '1000px' }}></div>
    </div>
  );
};

export default StickyComponent;
