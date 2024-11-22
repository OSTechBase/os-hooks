import { useState, useCallback, useRef } from 'react';

// 定义返回的元组类型
type UseUrlAsFileHook = [
  File | null,
  (url: string | URL, filename: string) => Promise<File | null>,
  () => void, // 取消请求的函数
];

const useUrlAsFile = (): UseUrlAsFileHook => {
  const [file, setFile] = useState<File | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchUrlAsFile = useCallback(
    async (url: string | URL, filename: string): Promise<File | null> => {
      // 取消或中止一个或多个 Web 请求或异步操作
      const controller = new AbortController();
      abortControllerRef.current = controller;
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const blob = await response.blob();
        const file = new File([blob], filename, { type: blob.type });
        setFile(file);
        return file;
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('Fetch aborted');
        } else {
          console.error(error);
        }
        setFile(null);
        return null;
      }
    },
    [],
  );
  // 取消请求
  const cancelFetch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return [file, fetchUrlAsFile, cancelFetch];
};

export default useUrlAsFile;
