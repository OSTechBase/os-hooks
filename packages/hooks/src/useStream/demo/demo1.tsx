import React from 'react';
import { useStream } from 'os-hooks';

const StickyComponent = () => {
  // const { data, run } = useStream('http://36.138.100.28:9090/wd/intelligentSearch/problemSearch', {
  // const { data, run } = useStream('/stream/chat/qOXzVl5kkvhQXM8r', {
  // const { data, run } = useStream('/stream/api/chat-messages', {
  const { messageList, run, setMessageList } = useStream('/v1/chat/completions', {
    init: {
      headers: {
        Authentication: 'Bearer cdzyjCC$oJmoCN*4LPgD2Lye_9JERU1KcGqzhW4d4yWMH_05SWVpfbGzzg_8yn1gsBH1opRO0qaX0'
      }
    },
    formatResult: (data) => {
      console.log('data', data);
      let partialData = data.replace('data: [DONE]', '')
      // 处理逐个接收到的数据块
      const jsonParts = partialData.split('data: ').filter(Boolean);
      const jsonData = jsonParts.map((part) => JSON.parse(part));
      const responseStr = jsonData.reduce((srt, item) => {
        const content = item.choices[0].delta.content;
        const response = content ? content : '';
        return srt + response;
      }, '');
      /* setMessageList((history: any) => {
        let newHistory;
        // 如果聊天记录最后一条不是机器人，则拼接一条机器人回答对象

        if (history[history.length - 1].type !== 'reply') {
          newHistory = [
            ...history,
            {
              type: 'reply',
              created: Date.now(),
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
      }); */
      return responseStr
    }
  });
  console.log('messageList', messageList);

  return (
    <div>
      <div>{JSON.stringify(messageList)}</div>
      {/* <button onClick={() => run({
        type: 'sending',
        created: Date.now(),
        response: '你是谁？'
      })}>发送</button> */}
      <button onClick={() => {
        run({
          // 模型名称随意填写
          "model": "qwen",
          "messages": [
            {
              "role": "user",
              "content": "你是谁？"
            }
          ],
          // 如果使用SSE流请设置为true，默认false
          "stream": true
        })
        setMessageList({
          type: 'sending',
          created: Date.now(),
          response: '你是谁？'
        })
      }}>发送</button>
    </div>
  );
};

export default StickyComponent;
