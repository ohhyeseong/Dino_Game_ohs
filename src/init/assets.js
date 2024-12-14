// gameAssets.js
import fs from 'fs';
// path라는 node.js 에서 지원을 해주는  기본 라이브러리를 불러온다.
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 모듈의 url을 나타내는 것
// fileURLToPath라는 매서드의 인자로 넣어주면 절대 경로를 찾을 수 있다.
const __filename = fileURLToPath(import.meta.url);
// 이 파일의 위치에 파일 이름을 제외한 경로를 나타내는 것
const __dirname = path.dirname(__filename);
//path.join을 통해서 지금 이 파일의 위치를 나타냄. 위치에서 뒤로 두 번 간만큼 + assets 폴더를 찾아서 들어가는 거다.
// 그럼 결과적으로 이 폴더의 위치를 특정할 수 있게 된다. (basePath가 폴더 위치라고 볼 수 있음. )
const basePath = path.join(__dirname, '../../assets');
// 전역 변수로 사용할 변수 하나 선언
let gameAssets = {};

// 파일 읽는 함수
// 비동기 병렬로 파일을 읽는다.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  try {
    //Promise.all() 은 여러 개의 프로미스(Promise) 를 비동기적으로 실행한다. 따라서 여러 개의 Promise 처리를 비동기적으로 실행하고자 할 때, 사용할 수 있다.
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);
    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (error) {
    throw new Error('Failed to load game assets: ' + error.message);
  }
};
// 선언한 전역 변수를 호출하는 함수를 만들어준다.
// 외부에서는 이 함수에 직접적으로 접근하는 게 아니고
// 함수 하나를 통해서 따로 호출을 해서 사용하도록 한다.
// 이유는 보안상
export const getGameAssets = () => {
  return gameAssets;
};
