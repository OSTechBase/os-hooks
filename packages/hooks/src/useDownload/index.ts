import { useCallback } from 'react';
import isImageUrl from '../utils/isImageUrl';
// 使用泛型来允许 data 是 string 或 Blob 类型
type DownloadFunctionType<T extends string | Blob> = (data: T, name: string) => void;
const useDownload = <T extends string | Blob>(
  type: 'url' | 'blob' = 'url',
): DownloadFunctionType<T> => {
  // 使用 useCallback 并确保依赖数组为空，因为此函数在组件生命周期内不应改变
  const download: DownloadFunctionType<T> = useCallback(
    async (data: T, name: string) => {
      let href: string;
      try {
        if (type === 'url') {
          if (isImageUrl(data as string)) {
            const response = await fetch(data as string);
            if (!response.ok) {
              throw new Error(`无法从中获取图片: ${data}`);
            }
            const blob = await response.blob();
            href = window.URL.createObjectURL(blob);
          } else {
            // 确保 data 是 string 类型
            href = data as string;
          }
        } else {
          // 确保 data 是 Blob 类型，并创建对象 URL
          href = window.URL.createObjectURL(data as Blob);
        }
        // 创建一个隐藏的 a 标签用于下载
        const link = document.createElement('a');
        link.href = href;
        // 设置下载文件的名称
        link.download = decodeURI(name);
        document.body.appendChild(link);
        // 触发下载
        link.click();
        // 清理：移除 a 标签并释放对象 URL（如果是 Blob 类型）
        document.body.removeChild(link);
        if (type === 'blob' || isImageUrl(data as string)) {
          window.URL.revokeObjectURL(href);
        }
      } catch (error) {
        console.error('Download failed:', error);
      }
    },
    [type],
  );

  return download;
};

export default useDownload;
