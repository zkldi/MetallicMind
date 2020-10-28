const config = require("../../config.js");
const db = require("../../db.js");
const Discord = require("discord.js");

// we're expecting data that looks like
// userID, game, playtype,
// goalsAchieved: [
//    {goalID, goalTitle, updateObj}
// ]

async function OnAchievedGoal(mind, goals) {
    let channelID = config.gameChannels[goals.game];
    if (!channelID) {
        console.error(`No channel found for game ${goals.game}?`);
        return;
    }

    let channel = await mind.channels.fetch(channelID);
    
    let user = await db.get("users").findOne({
        id: goals.userID
    }, {
        projection: {
            displayname: 1,
            username: 1,
            custompfp: 1,
            id: 1,
        }
    });

    let fields = [];
    for (const goal of goals.goalsAchieved) {
        fields.push({ name: goal.title , value: `${goal.previousProgHuman} => ${goal.progressHuman}` });
    }
    
    let pfpLink = `https://kamaitachi.xyz/static/images/users/${user.custompfp ? `${user.id}-pfp.png` : `0default-pfp.png`}`;

    let goalsEmbed = new Discord.MessageEmbed()
        .setColor("#cc527a")
        .setTitle(`${user.displayname} just achieved ${goals.goalsAchieved.length} ${goals.goalsAchieved.length === 1 ? "Goal" : "Goals"} (${goals.playtype})!`)
        .setAuthor(
            `${user.displayname} (@${user.username})`,
            pfpLink,
            `https://kamaitachi.xyz/dashboard/profiles/${user.id}/games/${goals.game}?playtype=${goals.playtype}`
        )
        .setThumbnail(pfpLink)
        .addFields(fields)
        .setTimestamp()

    channel.send(goalsEmbed);
}

module.exports = OnAchievedGoal;