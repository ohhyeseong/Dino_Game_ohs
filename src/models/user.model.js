// 유저는 해당 배열에 유저 객체로 저장이 된다고 생각하면 된다.
const users = [];
// addUser라는 이름의 함수를 정의하고, user라는 매개변수를 받는다.
export const addUser = (user) => {
  // users배열의 끝에 user 객체를 추가하는 메서드이다.
  users.push(user);
};

// 유저를 지우는 함수인데 uuid는 받을 필요 없고 socketId만 받아서 하면 된다.(현재 연결된 그 상태에서 데이터 통신을 하기 위해서 발급된 ID이기 때문에 )
export const removeUser = (SocketId) => {
  // 지우는 방식
  const index = users.findIndex((user) => user.SocketId === SocketId);
  // -1이면 이미 객체에 없는 상태이기 때문에
  if (index !== -1) {
    //유저의 인덱스에서 splice()로 하나를 지운다.
    return users.splice(index, 1)[0];
  }
};
// 유저를 조회하는 함수라고 생각하면 된다.
export const getUsers = () => {
  return users;
};
