const db = require("../../db.js");

async function Fluzz(mind, msg, args){
    msg.channel.send(`Warning: Fluzzarn has been repeatedly shown to have terrible opinions on random options.`);
}

module.exports = {
    desc: "G59 Nonran is good - Fluzzarn",
    secret: true,
    args: [],
    opts: {
        
    },
    handler: Fluzz
}