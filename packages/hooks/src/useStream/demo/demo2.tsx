import React from 'react';
import { useStream } from 'os-hooks';

const StickyComponent = () => {
  const { messageList, run } = useStream('/api/stream', {
    customize: true,
    formatResult: (data, setMessageList) => {
      let partialData = data.replace('data: [DONE]', '')
      // 处理逐个接收到的数据块
      const jsonParts = partialData.split('data:').filter(Boolean);
      const jsonData = jsonParts.map((part) => JSON.parse(part));
      const responseStr = jsonData.reduce((srt, item) => {
        const content = item.content;
        const response = content ? content : '';
        return srt + response;
      }, '');
      setMessageList((history: any) => {
        let newHistory;
        // 如果聊天记录最后一条不是机器人，则拼接一条机器人回答对象
        if (history[history.length - 1].type !== 'reply') {
          newHistory = [
            ...history,
            {
              type: 'reply',
              created: Date.now(),
              content: responseStr,
            },
          ];
        } else {
          // 聊天记录最后一条是机器人,则直接在机器人回答的内容后面拼接新回答
          history[history.length - 1].content =
            history[history.length - 1].content + responseStr;
          // 不能直接history赋值，要加上[... ]生成新对象,否则setState会认为引用地址没变，不执行页面刷新
          newHistory = [...history];
        }
        return newHistory;
      });
    }
  });

  return (
    <div>
      {
        messageList.map(item => {
          return <div key={item.created}>{item.content}</div>
        })
      }
      <button onClick={() => {
        run({
          // 模型名称随意填写
          "model": "qwen",
          "messages": [
            {
              "role": "user",
              "content": "你好"
            }
          ],
          // 如果使用SSE流请设置为true，默认false
          "stream": true
        },
          {
            type: 'sending',
            created: Date.now(),
            content: '你好'
          }
        )
      }}>发送</button>
    </div>
  );
};

export default StickyComponent;
