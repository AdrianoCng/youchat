const moment = require("moment");

const formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format("h:mm a"),
    };
};

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = { formatMessage, capitalize };
