import React from 'react';
import { useStream } from 'os-hooks';

const StickyComponent = () => {
  const { messageList, run } = useStream('/api/stream', {
    // init: {
    //   headers: {
    //     Authentication: 'Bearer cdzyjCC$oJmoCN*4LPgD2Lye_9JERU1KcGqzhW4d4yWMH_05SWVpfbGzzg_8yn1gsBH1opRO0qaX0'
    //   }
    // },
    formatResult: (data) => {
      let partialData = data.replace('data: [DONE]', '')
      // 处理逐个接收到的数据块
      const jsonParts = partialData.split('data:').filter(Boolean);
      const jsonData = jsonParts.map((part) => JSON.parse(part));
      const responseStr = jsonData.reduce((srt, item) => {
        const content = item.content;
        const response = content ? content : '';
        return srt + response;
      }, '');
      return {
        type: 'reply',
        id: Date.now(),
        response: responseStr,
      }
    }
  });

  return (
    <div>
      {
        messageList.map(item => {
          return <div key={item.id}>{item.response}</div>
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
            id: Date.now(),
            response: '你好'
          }
        )
      }}>发送</button>
    </div>
  );
};

export default StickyComponent;
