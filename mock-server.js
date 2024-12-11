const express = require('express');
const cors = require('cors');
const contentText = [
    '你好，',
    '欢迎',
    '使用',
    'os-hooks，',
    '希望os-hooks',
    '能解决你项目开发中',
    '对应场景的问题！',
]
const app = express();
app.use(cors());
app.post('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream'); // 指定流式响应
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let count = 0;

    // 每隔 1 秒发送一块数据
    const interval = setInterval(() => {
        if (count >= 7) {
            clearInterval(interval);
            res.write('data: [DONE]'); // 流结束标记
            res.end();
        } else {
            res.write(`data:{"content":"${contentText[count]}","id":${count}}`); // 发送一块数据
            count++;
        }
    }, 100);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Mock server running at http://localhost:${PORT}`);
});
