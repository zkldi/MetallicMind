const db = require("../../db.js");
const config = require("../../config.js");
const crypto = require("crypto");

async function KtchiLink(mind, msg, args){
    let existingUser = await db.get("users").findOne({
        "integrations.discord.discordID": msg.author.id
    });

    if (existingUser){
        msg.channel.send(`Your account is already linked to ${existingUser.displayname}!`);
        return;
    }

    let existingLink = await db.get("discord-links").findOne({
        discordID: msg.author.id
    });

    let linkID;

    if (existingLink){
        linkID = existingLink.link;
    }
    else {
        linkID = crypto.randomBytes(20).toString("hex");
        await db.get("discord-links").insert({
            discordID: msg.author.id,
            link: linkID
        });
    }

    msg.author.send(`Click the following link while logged into Kamaitachi: https://kamaitachi.xyz/dashboard/discord-auth/${linkID}`);
    msg.author.send("For obvious reasons. DO NOT SHARE THIS LINK WITH ANYONE.");

    msg.channel.send("You have been sent a DM with link instructions. If you haven't recieved it, check your DM settings, and try again.");
}

module.exports = {
    desc: "Links your Discord account with Kamaitachi.",
    args: [],
    handler: KtchiLink
}