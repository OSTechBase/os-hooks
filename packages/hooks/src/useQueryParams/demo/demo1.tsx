import React from 'react';
import { useQueryParams, useUnmount } from 'os-hooks';
import { addQueryParam, removeQueryParam } from '../../utils/queryParam'

const QueryParamsDisplay = () => {
  addQueryParam('id', '666');
  addQueryParam('name', '张三');

  const id = useQueryParams('id');
  const allParams = useQueryParams();

  useUnmount(() => {
    removeQueryParam('id');
    removeQueryParam('name');
  })
  return (
    <div>
      <p data-testid="id">Document Path: {id}</p>
      <pre data-testid="allParams">{JSON.stringify(allParams, null, 2)}</pre>
    </div>
  );
};

export default QueryParamsDisplay;
