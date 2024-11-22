import React from 'react';
import { useModalFn } from 'os-hooks';
import { ProFormText } from '@ant-design/pro-components';

const useModalDemo = () => {
  const openModal = useModalFn('form');
  const openModalFn = () => {
    openModal({
      title: '表单弹框',
      children: <><ProFormText width="md" name="name" label="name" /></>,
      onFinish: async (values) => {
        console.log('values', values);
        return true;
      },
      onClose: (e) => {
        console.log('onClose', e);

      }
    })
  }
  return (
    <div>
      <button onClick={openModalFn}>打开表单弹框</button>
    </div>
  );
};

export default useModalDemo;

