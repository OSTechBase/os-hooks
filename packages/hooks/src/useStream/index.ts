import { useState } from 'react';
interface Options {
  init?: RequestInit;
  formatResult: (res: string) => any;
}
// const useStream = async ({
//   url,
//   //   data,
//   Authentication,
//   method = 'POST',
// }: {
//   url: string;
//   data: any;
//   setData: Function;
//   Authentication: string;
//   method?: 'POST' | 'GET' | string;
//   // formatResult: (res: R) => U
// }) => {
const useStream = (streamUrl: string, options: Options) => {
  const { init, formatResult } = options ?? {};
  const [messageList, setMessageList] = useState<any>([]);
  // params
  const getDataStream = async (params: { [key: string]: any }) => {
    // setMessageList((history) => [...history, params]);
    try {
      // const response = await fetch(streamUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authentication: '',
      //   },
      //   body: JSON.stringify(data),
      // });
      const response = await fetch(streamUrl, {
        method: 'POST',
        ...init,
        body: JSON.stringify(params),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let partialData = '';
      while (true) {
        try {
          const { done, value }: any = await reader?.read();
          if (done) break;

          // partialData += decoder.decode(value, { stream: true }).replace('data: [DONE]', '');
          partialData += decoder.decode(value, { stream: true });
          const customizeResponse = formatResult(partialData);
          setMessageList((history: any) => [...history, customizeResponse]);
          // // 处理逐个接收到的数据块
          // const jsonParts = partialData.split('data: ').filter(Boolean);
          // const jsonData = jsonParts.map((part) => JSON.parse(part));
          // const responseStr = jsonData.reduce((srt, item) => {
          //   const content = item.choices[0].delta.content;
          //   const response = content ? content : '';
          //   return srt + response;
          // }, '');
          // setMessageList((history: any) => {
          //   let newHistory;
          //   // 如果聊天记录最后一条不是机器人，则拼接一条机器人回答对象

          //   if (history[history.length - 1].type !== 'reply') {
          //     newHistory = [
          //       ...history,
          //       {
          //         type: 'reply',
          //         created: Date.now(),
          //         response: responseStr,
          //       },
          //     ];
          //   } else {
          //     // 聊天记录最后一条是机器人,则直接在机器人回答的内容后面拼接新回答
          //     history[history.length - 1].response =
          //       history[history.length - 1].response + responseStr;
          //     // 不能直接history赋值，要加上[... ]生成新对象,否则setState会认为引用地址没变，不执行页面刷新
          //     newHistory = [...history];
          //   }
          //   return newHistory;
          // });
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
    setMessageList: (value) => setMessageList((history: any) => [...history, value]),
  };
};
export default useStream;
