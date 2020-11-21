const db = require("../../db.js");

async function DamnitJag(mind, msg, args){
    let damnTimes = await db.get("metallic-mind-damnitjag").count({});

    msg.channel.send(`Nice one Jag. Jag has been damned ${damnTimes} times.`);

    await db.get("metallic-mind-damnitjag").insert({
        id: msg.author.id,
        timestamp: Date.now()
    });
}

module.exports = {
    desc: "Has Jag said something stupid again?",
    secret: true,
    args: [],
    opts: {
        
    },
    handler: DamnitJag
}