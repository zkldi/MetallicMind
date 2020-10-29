const db = require("../../db.js");

const thankMsgs = [
    "Thank you too",
    "No problem",
    "No problem, I have to do it",
    "Don't worry, I'm forced to do this",
    "I'm really hungry",
    "No worries",
    "Don't worry about it",
    "Thanks",
    "no u",
    "If I don't do what I'm told, zkldi will rewrite me in PHP",
    "Poggers",
    "Pog Champ",
    "Epic",
    "Wow, this means a lot",
    "No, thank you",
    "Thanks, but you smell",
    "You're cool",
    "Did you know, anime girls are real?",
    "TypeError: thankMsg is undefined"
]

async function Thank(mind, msg, args){
    let thanked = await db.get("metallic-mind-thanks").findOne({
        id: msg.author.id
    });

    if (thanked) {
        msg.channel.send("You've already thanked me!");
    }
    else {
        let thankMsg = thankMsgs[Math.floor(Math.random() * thankMsgs.length)];

        let thankedTimes = await db.get("metallic-mind-thanks").count({});

        msg.channel.send(`${thankMsg}!\nI have been thanked ${thankedTimes} times.`);

        await db.get("metallic-mind-thanks").insert({
            id: msg.author.id
        });
    }
}

module.exports = {
    desc: "Show your appreciation for me.",
    secret: true,
    args: [],
    opts: {
        
    },
    handler: Thank
}