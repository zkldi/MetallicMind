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

    let baseChannel = "770373687048011787"; // Kamaitachi #bot;
    global.BASE_URL = "https://kamaitachi.xyz";
    if (process.env.NODE_ENV === "dev") {
        baseChannel = "769803764021592107" // zkldi test server
        global.BASE_URL = "http://127.0.0.1:8080";
    }

    HarassNyannurs();

    mind.channels.fetch(baseChannel).then(c => {
        c.send(`Deploy successful. Updated to v${config.ver.major}.${config.ver.minor}.${config.ver.patch}${config.ver.suffix} (${config.ver.title})!`);
    })
});

// temp, and a joke.
function HarassNyannurs() {
    let harassNyannursChannel = "814611709557080106";

    setInterval(() => {
        mind.channels.fetch(harassNyannursChannel).then(c => {
            c.send(`<@257023444175028234> http://zkldi.xyz/static/nugget.gif`);
        });
    }, 1000 * 60 * 60 * 24);

    mind.channels.fetch(harassNyannursChannel).then(c => {
        c.send(`<@257023444175028234> http://zkldi.xyz/static/nugget.gif`);
    });
}

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
