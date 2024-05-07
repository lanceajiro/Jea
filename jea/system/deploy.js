const fs = require('fs');
const { hm, warn } = require('./logs');

// Deploy Commands
const deploy = () => {
    hm("Deploying Commands");
    const commandDir = "./commands";
    if (!fs.existsSync(commandDir)) {
        fs.mkdirSync(commandDir);
    }
    for (let file of fs.readdirSync(commandDir)) {
        if (file.endsWith(".js")) {
            hm("Deployed Command: " + file);
        }
    }
    hm("Finished deploying commands");
};

module.exports = deploy;
