import React from 'react';
import { useModalFn } from 'os-hooks';

const useModalDemo = () => {
  const openModal = useModalFn();
  const openModalFn = () => {
    openModal({
      title: '基本弹框',
      children: <>基本弹框</>,
      destroyOnClose: true,
      onOk: () => {
        return true;
      },
      onClose: () => {
        console.log('onClose');
      },
    });
  }
  return (
    <div>
      <button onClick={openModalFn}>打开弹框</button>
    </div>
  );
};

export default useModalDemo;

