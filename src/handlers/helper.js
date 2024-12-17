import { getUsers, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
  console.log('Current users:', getUsers());

  // 스테이지 빈 배열 생성
  createStage(uuid);

  socket.emit('connection', { uuid });
};

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
};

export const handleEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);
  // 유저 모두한테 보내는 함수 ( 서버와 연결된 그 소켓 객체 자체에 붙어있는 emit() 메서드를 사용해서 처리를 해주면 된다.)
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }
  socket.emit('response', response);
};
