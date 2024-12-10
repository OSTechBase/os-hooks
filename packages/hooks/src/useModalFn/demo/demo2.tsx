import React, { useState } from 'react';
import { useLatest, useModalFn } from 'os-hooks';
import { ProFormText } from '@ant-design/pro-components';

const useModalDemo = () => {
  const openModal = useModalFn('form');
  const [value, setValue] = useState('hello')
  const latestCountRef = useLatest(value);
  const openModalFn = () => {
    openModal({
      title: '表单弹框',
      children: <><ProFormText width="md" name="name" label="name" fieldProps={{
        onChange: (e) => {
          setValue(e.target.value)
        }
      }} /></>,
      onFinish: async (values) => {
        console.log('values', values);
        console.log('name', value);
        console.log('name-latestCountRef', latestCountRef.current);
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

