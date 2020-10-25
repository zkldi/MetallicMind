const fetch = require("node-fetch");
const config = require("../../config.js");

async function Status(mind, msg, args){
    let status = `Running METALLIC MIND v${config.ver.major}.${config.ver.minor}.${config.ver.patch}${config.ver.suffix} (${config.ver.title})`;
    if (args[1] === "no-ktchi"){
        msg.channel.send(status);
    }
    else {
        let ktStatus = await fetch("https://kamaitachi.xyz").then(r => r.status);
        ktStatus = ktStatus === 200 ? "Alive": `Dead (${ktStatus})`;

        msg.channel.send(`
            ${status}.\nKamaitachi Status: ${ktStatus}.
        `);
    }
}

module.exports = {
    desc: "Checks the bot, and Kamaitachi, are working.",
    args: [
        {
            required: false,
            val: "no-ktchi"
        }
    ],
    handler: Status
}