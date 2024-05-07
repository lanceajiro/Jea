const m = require("moment-timezone");
const gradient = require('gradient-string');

const blu = gradient("#243aff", "#4687f0", "#5800d4");
const red = gradient("red", "yellow", "cyan");

function getTime() {
    return m.tz("Asia/Manila").format("HH:mm:ss");
}

function log(text, color, prefix = `[${getTime()}] [ Jea ] » `) {
    process.stderr.write(color(`${prefix}${text}\n`));
}

module.exports.hm = (text) => {
    log(text, blu);
};

module.exports.sys = (text) => {
    log(text, blu, `[${getTime()}] [ System ] » `);
};

module.exports.inf = (text) => {
    log(text, blu, `[${getTime()}] [ Inf ] » `);
};

module.exports.warn = (text) => {
    log(text, red);
};

module.exports.error = (text) => {
    log(text, red);
};
