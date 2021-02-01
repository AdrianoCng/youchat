const form = document.getElementById("chat-form");
const message = document.getElementById("msg");
const chatMessages = document.querySelector(".chat-messages");
const usersListDOM = document.getElementById("users");
const typingNotification = document.getElementById("typing-notification");

// Get username from query string
const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// Connect
const socket = io();

// Send username
socket.emit("user join", username);

// Receiving messages
socket.on("message", (msg) => {
    outputMsg(msg);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Sending message
form.addEventListener("submit", (event) => {
    event.preventDefault();

    socket.emit("message", message.value);

    socket.emit("typing", false);

    message.value = "";
    message.focus();
});

// typing notification
message.addEventListener("keyup", (event) => {
    event.key !== "Enter" && message.value !== ""
        ? socket.emit("typing", true)
        : socket.emit("typing", false);
});

socket.on("typing", (usersTyping) => {
    const clientSideUsers = usersTyping.filter((user) => user.id !== socket.id);

    typingNotification.innerHTML = formatTypingNotification(clientSideUsers);
});

// Receiving users list
socket.on("users list", (usersList) => {
    outputUsers(usersList);
});

socket.on("disconnect", () => {
    socket.close();
});

// DOM manipulation
const outputMsg = ({ username, text, time }) => {
    const div = document.createElement("div");
    div.classList.add("message");

    div.innerHTML = `
        <p class="meta">${username} <span>${time}</span></p>
        <p class="text">
            ${text}
        </p>
    `;

    chatMessages.append(div);
};

const outputUsers = (usersList) => {
    usersListDOM.innerHTML = `
        ${usersList.map((user) => `<li>${user.username}</li>`).join("")}
    `;
};

const formatTypingNotification = (usersTyping) => {
    if (usersTyping.length > 1) {
        return `${usersTyping
            .map((user) => user.username)
            .join(", ")} are typing...`;
    } else if (usersTyping.length === 1) {
        return `${usersTyping[0].username} is typing...`;
    } else {
        return "";
    }
};
