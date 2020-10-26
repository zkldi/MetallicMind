const db = require("../../db.js");
const config = require("../../config.js");
const crypto = require("crypto");
const userUtil = require("../../util/users.js");
const Discord = require("discord.js");

async function Profile(mind, msg, args){
    let user;
    if (args[1]){
        user = await userUtil.GetUserFriendly(args[1]);
        if (!user) {
            msg.channel.send(`Could not find user \`${args[1]}\``);
        }
    }
    else {
        user = await userUtil.GetRequestingUser(msg);
        if (!user) {
            msg.channel.send("You are not `!link`ed with Kamaitachi!");
        }
    }

    if (user){
        let pfpLink = `https://kamaitachi.xyz/static/images/users/${user.custompfp ? `${user.id}-pfp.png` : `0default-pfp.png`}`;

        let fields = [];

        for (const game of config.supportedGames) {
            if (!user.ratings[game] || !user.lampRatings[game]){
                continue;
            }

            for (const playtype of config.validPlaytypes[game]) {
                let field = {
                    name: `${config.gameHuman[game]} (${playtype})`,
                    inline: true
                };
                let val = "";

                if (!user.ratings[game][playtype] || !user.lampRatings[game][playtype]) {
                    continue;
                }

                let rtRank = await db.get("users").count({
                    [`ratings.${game}.${playtype}`]: {$gte: user.ratings[game][playtype]}
                });

                let lmRank = await db.get("users").count({
                    [`lampRatings.${game}.${playtype}`]: {$gte: user.lampRatings[game][playtype]}
                });

                let totalPlayers = await db.get("users").count({
                    [`ratings.${game}.${playtype}`]: {$gte: 0}
                });

                val = `Rating: ${user.ratings[game][playtype].toFixed(2)} (#${rtRank}/${totalPlayers})\nLamp Rating: ${user.lampRatings[game][playtype].toFixed(2)} (#${lmRank}/${totalPlayers})`

                if (user.customRatings[game] && user.customRatings[game][playtype]) {
                    for (const cust in user.customRatings[game][playtype]) {
                        let csRank = await db.get("users").count({
                            [`customRatings.${game}.${playtype}.${cust}`]: {$gte: user.customRatings[game][playtype][cust]}
                        }) + 1;


                        val += `\n${cust}: ${user.customRatings[game][playtype][cust].toFixed(2)} (#${csRank}/${totalPlayers})`;
                    }
                }

                let scores = await db.get("scores").count({
                    userID: user.id,
                    game: game,
                    "scoreData.playtype": playtype
                });

                val += `\nScores: ${scores}`;

                let sessions = await db.get("sessions").count({
                    userID: user.id,
                    game: game,
                    playtype: playtype
                });

                val += `\nSessions: ${sessions}`;

                field.value = val;

                fields.push(field);
            }
        }

        let profileEmbed = new Discord.MessageEmbed()
            .setColor("#cc527a")
            .setTitle(`${user.displayname}'s Profile`)
            .setAuthor(
                `${user.displayname} (@${user.username})`,
                pfpLink,
                `https://kamaitachi.xyz/dashboard/profiles/${user.id}`
            )
            .setThumbnail(pfpLink)
            .addFields(fields)

        msg.channel.send(profileEmbed);
    }
}

module.exports = {
    desc: "Displays your Kamaitachi Profile (requires `!link`).",
    args: [{
        required: false,
        val: ["id", "username"]
    }],
    handler: Profile
}