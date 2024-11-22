import { useDownload } from 'os-hooks';

const DownloadDemo = () => {
  const download = useDownload('blob');
  const handleDownload = () => {
    const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
    download(blob, 'example.txt');
  };
  return <button onClick={handleDownload}>Blob下载</button>;
};

export default DownloadDemo;
