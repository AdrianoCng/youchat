const form = document.getElementById("chat-form");
const message = document.getElementById("msg");
const chatMessages = document.querySelector(".chat-messages");
const usersListDOM = document.getElementById("users");

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

    // Scroll chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Sending message
form.addEventListener("submit", (event) => {
    event.preventDefault();

    socket.emit("message", message.value);

    message.value = "";
    message.focus();
});

// Receiving users list
socket.on("users list", (usersList) => {
    outputUsers(usersList);
});

socket.on("error", function () {
    socket.socket.reconnect();
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
