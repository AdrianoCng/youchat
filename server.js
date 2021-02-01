const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

// Utils
const { formatMessage } = require("./utils/utils");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getAllUsers,
    addUserTyping,
    removeUserTyping,
    getUsersTyping,
} = require("./utils/users");

const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "Admin";

io.on("connection", (socket) => {
    socket.on("user join", (username) => {
        // Add user to users array
        const user = userJoin(socket.id, username);

        // Display typing notification is someone was already typing before client connects
        socket.emit("typing", getUsersTyping());

        socket.emit("message", formatMessage(botName, "Welcome to YouChat!"));

        socket.broadcast.emit(
            "message",
            formatMessage(botName, `${user.username} has joined the chat`)
        );

        // send users list
        io.emit("users list", getAllUsers());

        socket.on("message", (msg) => {
            const { username } = getCurrentUser(socket.id);

            // Send message to all users
            io.emit("message", formatMessage(username, msg));
        });

        // Typing notification
        socket.on("typing", (typing) => {
            const { username } = getCurrentUser(socket.id);

            const usersTyping = typing
                ? addUserTyping(socket.id, username)
                : removeUserTyping(socket.id);

            socket.broadcast.emit("typing", usersTyping);
        });

        socket.on("disconnect", () => {
            // Remove user from users array
            userLeave(socket.id);

            // Remove user from users typing array to avoid displaying notification in case the users left while still typing
            const usersTyping = removeUserTyping(socket.id);
            io.emit("typing", usersTyping);

            io.emit(
                "message",
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // send updated users list
            io.emit("users list", getAllUsers());
        });
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
