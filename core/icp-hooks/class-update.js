const config = require("../../config.js");
const db = require("../../db.js");
const Discord = require("discord.js");

// we're expecting data that looks like
/*
    {
        game,
        service,
        playtype,
        from,
        to,
        fromHuman,
        toHuman,
        timestamp,
        userID
    }
 */

async function OnClassUpdate(mind, classData) {
    let channelID = config.gameChannels[classData.game];
    if (!channelID) {
        console.error(`No channel found for game ${goals.game}?`);
        return;
    }

    let channel = await mind.channels.fetch(channelID);
    
    let user = await db.get("users").findOne({
        id: classData.userID
    }, {
        projection: {
            displayname: 1,
            username: 1,
            custompfp: 1,
            id: 1,
        }
    });

    let pfpLink = `https://kamaitachi.xyz/static/images/users/${user.custompfp ? `${user.id}-pfp.png` : `0default-pfp.png`}`;

    let classEmbed = new Discord.MessageEmbed()
        .setColor("#cc527a")
        .setTitle(`${user.displayname} just achieved ${classData.toHuman} (${classData.playtype})!`)
        .setAuthor(
            `${user.displayname} (@${user.username})`,
            pfpLink,
            `https://kamaitachi.xyz/dashboard/profiles/${user.id}/games/${goals.game}?playtype=${goals.playtype}`
        )
        .setThumbnail(pfpLink)
        .setTimestamp()

    channel.send(classEmbed);
}

module.exports = OnClassUpdate;