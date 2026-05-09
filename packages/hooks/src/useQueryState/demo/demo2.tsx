import React from 'react';
import { Button, Space } from 'antd';
import { useQueryState } from 'os-hooks';

const DefaultValueDemo = () => {
  const [status, setStatus, { remove }] = useQueryState<'all' | 'open' | 'closed'>('status', {
    defaultValue: 'all',
  });

  return (
    <Space direction="vertical">
      <Space>
        <Button onClick={() => setStatus('all')}>全部</Button>
        <Button onClick={() => setStatus('open')}>进行中</Button>
        <Button onClick={() => setStatus('closed')}>已完成</Button>
        <Button danger onClick={remove}>
          移除参数
        </Button>
      </Space>
      <div>当前状态：{status}</div>
      <div>当 URL 中没有这个参数时，会回退到默认值。</div>
    </Space>
  );
};

export default DefaultValueDemo;
