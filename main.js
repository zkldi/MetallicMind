const Discord = require('discord.js');
const secrets = require("./secrets.js");
const config = require("./config.js");
const mind = new Discord.Client();
const core = require("./core/core.js");
const redisICP = require("./redisICP.js");

mind.on("ready", () => {
    console.log("==== BOOTUP ====");
    console.log(`Running METALLIC MIND v${config.ver.major}.${config.ver.minor}.${config.ver.patch}${config.ver.suffix} (${config.ver.title})`);
    core.InitialiseICP(mind);
    console.log("==== BOOTUP FINISHED ====");

    mind.channels.fetch("770373687048011787").then(c => {
        c.send(`Deploy successful. Updated to v${config.ver.major}.${config.ver.minor}.${config.ver.patch}${config.ver.suffix} (${config.ver.title})!`);
    })
});

mind.on("message", msg => {
    try {
        core.HandleMessage(mind, msg);
    }
    catch (err) {
        console.error(msg);
        console.error(err);
        msg.channel.send("An error has occured.");
    }
});

if (process.env.NODE_ENV === "dev"){
    mind.login(secrets.testingToken);
}
else {
    mind.login(secrets.token);
}
