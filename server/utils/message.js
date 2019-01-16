var moment = require('moment');

var generateMessage = (from, text) => {
    var date = moment();
    return {
        from,
        text,
        createdAt: date.format('MMM Do, YYYY h:mm a')
    }
};

module.exports = {generateMessage};