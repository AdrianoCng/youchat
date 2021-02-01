const { capitalize } = require("./utils");

let users = [];

let usersTyping = [];

const userJoin = (id, username) => {
    const user = {
        id,
        username: username ? capitalize(username) : `User-${id}`,
    };

    users.push(user);

    return user;
};

const userLeave = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        users.splice(index, 1);
    }
};

const getCurrentUser = (id) => {
    return users.find((user) => user.id === id);
};

const getAllUsers = () => {
    return users;
};

const addUserTyping = (id, username) => {
    const user = {
        id,
        username,
    };

    const index = usersTyping.findIndex((user) => user.id === id);

    if (index === -1) {
        usersTyping.push(user);
    }

    return usersTyping;
};

const removeUserTyping = (id) => {
    const index = usersTyping.findIndex((user) => user.id === id);

    if (index !== -1) {
        usersTyping.splice(index, 1);
    }

    return usersTyping;
};

const getUsersTyping = () => {
    return usersTyping;
};

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getAllUsers,
    addUserTyping,
    removeUserTyping,
    getUsersTyping,
};
