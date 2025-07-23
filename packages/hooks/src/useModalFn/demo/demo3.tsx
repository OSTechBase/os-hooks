import React from 'react';
import { useModalFn } from 'os-hooks';
import { ProFormColumnsType } from '@ant-design/pro-components';
type DataItem = {
  name: string;
  state: string;
};
const valueEnum = {
  all: { text: '全部', status: 'Default' },
  open: {
    text: '未解决',
    status: 'Error',
  },
  closed: {
    text: '已解决',
    status: 'Success',
    disabled: true,
  },
  processing: {
    text: '解决中',
    status: 'Processing',
  },
};
const columns: ProFormColumnsType<DataItem>[] = [
  {
    title: '标题',
    dataIndex: 'title',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    width: 'm',
  },
  {
    title: '状态',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum,
    width: 'm',
  },
]
const useModalDemo = () => {
  const openModal = useModalFn<DataItem>('form');
  const openModalFn = () => {
    openModal({
      title: '使用 columns 的表单弹框',
      columns,
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

