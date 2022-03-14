const users: { id: string; username: string; room: string; admin: boolean }[] = [];

// Join user to chat
export function userJoin(id: string, username: string, room: string, admin: boolean) {
  const user = { id, username, room, admin };

  users.push(user);

  return user;
}

// Check if new user is admin to their room
export function checkUserAdmin(room : string) {
  const exists = users.find(user => {return room === user.room});

  return exists ? false : true;
}

// Get current user
export function getCurrentUser(id : string) {
  return users.find(user => {return user.id === id});
}

// User leaves chat
export function userLeave(id : string) {
  const index = users.findIndex(user => {return user.id === id});

  if (index !== -1 && !users[index].admin) {
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
  checkRoomEmpty,
  checkUserAdmin
};