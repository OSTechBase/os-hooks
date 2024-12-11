import { useState } from 'react';
interface Options {
  init?: RequestInit;
  formatResult: (res: any) => any;
}
type ParamsType = { [key: string]: any };
type streamOption = {
  messageList: any[];
  run: (params: ParamsType, message: any) => Promise<void>;
};
const useStream = (streamUrl: string, options: Options): streamOption => {
  const { init, formatResult } = options ?? {};
  const [messageList, setMessageList] = useState<any>([]);
  const getDataStream = async (params: ParamsType, message: any) => {
    setMessageList((history) => [...history, message]);
    try {
      const response = await fetch(streamUrl, {
        method: 'POST',
        body: JSON.stringify(params),
        ...init,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let partialData = '';
      while (true) {
        try {
          const { done, value }: any = await reader?.read();
          if (done) break;
          partialData += decoder.decode(value, { stream: true });
          const customizeResponse = formatResult(partialData);
          setMessageList((history: any) => [...history, customizeResponse]);
          partialData = '';
        } catch (e) {
          console.log('Error parsing JSON:', e);
          // 如果 JSON 不完整，则继续累积
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  return {
    messageList,
    run: getDataStream,
  };
};
export default useStream;
