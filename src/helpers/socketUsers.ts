const users: { id: string; username: string; room: string; }[] = [];

// Join user to chat
export function userJoin(id: string, username: string, room: string) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
export function getCurrentUser(id : string) {
  return users.find(user => {return user.id === id});
}

// User leaves chat
export function userLeave(id : string) {
  const index = users.findIndex(user => {return user.id === id});

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// eslint-disable-next-line no-undef
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave
};