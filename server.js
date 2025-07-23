const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 存储当前的文本内容
let currentText = "";

// 允许访问前端文件
app.use(express.static(__dirname));

io.on('connection', (socket) => {
  console.log('a user connected');

  // 新用户连接时，发送当前的文本内容
  socket.emit('initial text', currentText);

  // 监听来自客户端的文本更新
  socket.on('text update', (newText) => {
    currentText = newText;
    // 将更新广播给所有其他客户端
    socket.broadcast.emit('text update', currentText);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
