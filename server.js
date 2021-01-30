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

        socket.on("disconnect", (reason) => {
            socket.emit("reason", reason);
            // Remove user from users array
            userLeave(socket.id);

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
