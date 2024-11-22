import { useDownload } from 'os-hooks';

const DownloadDemo = () => {
  const download = useDownload();
  const handleDownload = () => {
    const url = 'https://ostechbase.github.io/os-hooks/short-logo.png';
    download(url, 'os-hooks-logo.png');
  };
  return <button onClick={handleDownload}>URL下载</button>;
};

export default DownloadDemo;
