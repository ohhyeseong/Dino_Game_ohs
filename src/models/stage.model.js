const stages = {};

export const createStage = (uuid) => {
  stages[uuid] = []; // 초기 스테이지 배열 생성
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = async (uuid, id, timestamp) => {
  return await stages[uuid].push({ id, timestamp });
};

export const clearStage = (uuid) => {
  return (stages[uuid] = []);
};
