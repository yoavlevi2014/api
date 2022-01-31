const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => {return user.id === id});
}

// User leaves chat
function userLeave(id) {
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