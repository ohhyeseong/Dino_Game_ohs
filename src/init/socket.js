import { Server as SocketIO } from 'socket.io'; // socket.io라는 라이브러리에서 쓸거니까 server를 socketIo로 이름을 변경해줌
import registerHandler from '../handlers/regiser.handler.js';

// socketIO 서버를 생성해준다.
const initSocket = (server) => {
  const io = new SocketIO();
  // attach란 메서드를 사용해서 서버에 연결을 해준다.
  io.attach(server);
  // 여기서 io객체를 넘겨주고 호출을 해줌.
  registerHandler(io);
};

// 이 init에 들어있는 파일들은 app.js가 실행이 될때 항상 같이 실행이 되는 친구들이다.
export default initSocket;
