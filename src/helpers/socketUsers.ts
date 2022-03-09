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

// Checks if the user is alone, if not, a user id from that room is returned
export function checkRoomEmpty(room: string) {
  return users.find(user => {return user.room == room})?.id;
}

// eslint-disable-next-line no-undef
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  checkRoomEmpty
};