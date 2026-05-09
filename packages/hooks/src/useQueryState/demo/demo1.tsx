import React, { useEffect, useState } from 'react';
import { Button, Input, Space } from 'antd';
import { useQueryState } from 'os-hooks';

const QueryStateDemo = () => {
  const [filters, setFilters] = useQueryState('filters', {
    defaultValue: {
      keyword: '',
      page: 1,
    },
  });
  const [draftKeyword, setDraftKeyword] = useState(filters?.keyword || '');
  const keyword = filters?.keyword || '';
  const page = filters?.page || 1;

  useEffect(() => {
    setDraftKeyword(keyword);
  }, [keyword]);

  return (
    <Space direction="vertical">
      <Input
        style={{ width: 280 }}
        value={draftKeyword}
        placeholder="请输入关键字"
        onChange={(event) => {
          setDraftKeyword(event.target.value);
        }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => {
            setFilters((prev) => ({
              keyword: draftKeyword,
              page: prev?.page || 1,
            }));
          }}
        >
          确认
        </Button>
        <Button
          onClick={() => {
            setFilters((prev) => ({
              keyword: prev?.keyword || '',
              page: Math.max((prev?.page || 1) - 1, 1),
            }));
          }}
        >
          上一页
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setFilters((prev) => ({
              keyword: prev?.keyword || '',
              page: (prev?.page || 1) + 1,
            }));
          }}
        >
          下一页
        </Button>
      </Space>
      <div>当前查询关键字：{keyword || '无'}</div>
      <div>当前页码：{page}</div>
      <div>刷新页面后，URL 中的参数会自动回填。</div>
    </Space>
  );
};

export default QueryStateDemo;
