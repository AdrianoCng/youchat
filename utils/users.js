const { capitalize } = require("./utils");

let users = [];

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

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getAllUsers,
};
