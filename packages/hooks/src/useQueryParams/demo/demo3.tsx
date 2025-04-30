import React from 'react';
import { useQueryParams } from 'os-hooks';

const QueryParamsDisplay = () => {
  const params = useQueryParams({ url: 'https://example.com/path?foo=hello&bar=world' });

  return (
    <div>
      <div>自定义完整 URL 获取所有参数：</div>
      <div>foo: {params.foo}</div>
      <div>bar: {params.bar}</div>
    </div>
  );
};

export default QueryParamsDisplay;
