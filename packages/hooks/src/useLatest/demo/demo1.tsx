/**
 * title: 基础用法
 * desc: useLatest 返回的永远是最新值
 */

import React, { useState, useEffect } from 'react';
import { useLatest } from 'os-hooks';

export default () => {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);
  const latestCountRef = useLatest(count);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(latestCountRef.current + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount2(count2 + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <p>count: {count}</p>
      <p>count(defult): {count2}</p>
    </>
  );
};
