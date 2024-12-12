const users = [];

export const addUser = (user) => {
  users.push(user);
};

export const removeUser = (SocketId) => {
  const index = users.findIndex((user) => user.SocketId === SocketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUsers = () => {
  return users;
};
