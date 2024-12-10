const express = require('express');

const app = express();

app.get('/api/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream'); // 指定流式响应
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let count = 0;

    // 每隔 1 秒发送一块数据
    const interval = setInterval(() => {
        if (count >= 5) {
            clearInterval(interval);
            res.write('data: [DONE]\n\n'); // 流结束标记
            res.end();
        } else {
            res.write(`data: Chunk ${count}\n\n`); // 发送一块数据
            count++;
        }
    }, 1000);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Mock server running at http://localhost:${PORT}`);
});
