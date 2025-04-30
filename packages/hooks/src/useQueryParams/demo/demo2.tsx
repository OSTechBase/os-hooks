import React from 'react';
import { useQueryParams } from 'os-hooks';

const QueryParamsDisplay = () => {
  const id = useQueryParams('id', { search: '?id=123&name=test' });

  return (
    <div>
      <div>自定义 search 获取参数：</div>
      <div>id: {id}</div>
    </div>
  )
};

export default QueryParamsDisplay;
