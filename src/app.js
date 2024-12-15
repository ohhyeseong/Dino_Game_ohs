import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express();
// 이 변수로 인해서 server를 키고 웹소켓을 이용하는 행위를 한다.
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
// url 인코딩 해주는 (payload) 를 자동으로 파싱해준다는 뜻
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
// 여기에 호출하게 되면 3000포트로 socketIO가 연결된거를 확인 할 수가 있다.
initSocket(server);
// 서버가 정상적으로 잘 열렸는지 확인하기 위해 get메서드를 통해 localhost:3000 으로 들어가면 Hello World 가 줄력됨
app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});
// 서버를 작동하는 로직
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // 이 곳에서 파일 읽음
  try {
    const assets = await loadGameAssets();
    console.log(assets);
    console.log('Assets loaded successfully');
  } catch (error) {
    console.error('Failed to load game assets:', error);
  }
});
