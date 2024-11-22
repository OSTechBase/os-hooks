import React from 'react';
import { useUrlAsFile } from 'os-hooks';

const UrlAsFile = () => {
  const [file, setUrlAsFile, cancelFetch] = useUrlAsFile();

  const handleDownload = async () => {
    const file = await setUrlAsFile('https://ostechbase.github.io/os-hooks/short-logo.png', 'short-logo.png');
    if (file) {
      console.log('File fetched:', file);
    }
  };

  const handleCancel = () => {
    cancelFetch();
  };

  return (
    <div>
      <button onClick={handleDownload}>开始</button>
      <button onClick={handleCancel}>取消</button>
      {file && <p>Downloaded file: {file.name}</p>}
    </div>
  );
};

export default UrlAsFile;
