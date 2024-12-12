import { useState } from 'react';
// 定义基础类型
type ParamsType = { [key: string]: any };
type StreamOption = {
  messageList: any[];
  run: (params: ParamsType, message: any) => Promise<void>;
};

// 定义函数类型
type FormatResultType = (res: any) => string;
type CustomizeFormatResultType = (res: any, callback: (updatedMessageList: any) => any) => void;

// 定义 Options 类型
interface Options {
  init?: RequestInit;
  formatResult: FormatResultType;
  customize?: false;
}

interface CustomizeOptions {
  init?: RequestInit;
  formatResult: CustomizeFormatResultType;
  customize: true;
}

// 定义重载签名
function useStream(streamUrl: string, options: Options): StreamOption;
function useStream(streamUrl: string, options: CustomizeOptions): StreamOption;

function useStream(streamUrl: string, options: Options | CustomizeOptions): StreamOption {
  const { init, formatResult, customize = false } = options ?? {};
  const [messageList, setMessageList] = useState<any[]>([]);
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
          if (customize) {
            (formatResult as CustomizeFormatResultType)(partialData, setMessageList);
          } else {
            const responseStr = (formatResult as FormatResultType)(partialData);
            setMessageList((history: any) => {
              let newHistory;
              // 如果聊天记录最后一条不是机器人，则拼接一条机器人回答对象
              if (history[history.length - 1].type !== 'reply') {
                newHistory = [
                  ...history,
                  {
                    type: 'reply',
                    id: Date.now(),
                    response: responseStr,
                  },
                ];
              } else {
                // 聊天记录最后一条是机器人,则直接在机器人回答的内容后面拼接新回答
                history[history.length - 1].response =
                  history[history.length - 1].response + responseStr;
                // 不能直接history赋值，要加上[... ]生成新对象,否则setState会认为引用地址没变，不执行页面刷新
                newHistory = [...history];
              }
              return newHistory;
            });
          }
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
}
export default useStream;
