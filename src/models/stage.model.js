const stages = {};

export const createStage = (uuid) => {
  stages[uuid] = []; // 초기 스테이지 배열 생성
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, id, timestamp) => {
  // 초기화 확인 및 로그 추가
  if (!stages[uuid]) {
    console.log(`Initializing stages for user: ${uuid}`);
    stages[uuid] = [];
  }

  return stages[uuid].push({ id, timestamp });
};

export const clearStage = (uuid) => {
  stages[uuid] = [];
};
