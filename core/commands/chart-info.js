const fetch = require("node-fetch");
const config = require("../../config.js");
const userUtil = require("../../util/users.js");
const Discord = require("discord.js");
const GetChartsHuman = require("../../util/get-charts.js");
const FormatScore = require("../../util/format-score.js");
const db = require("../../db.js");

async function ChartInfo(mind, msg, args, opts){
    let user = await userUtil.RequireLinkAndSecureInfo(msg);
    if (!user) {
        return;
    }

    let {song, charts} = await GetChartsHuman(user, msg, args, opts);

    let chart = charts[0];

    if (!chart) {
        msg.channel.send("Could not find the specified chart!");
        return;
    }

    let requestedUser = null;

    // override user with opts
    if (opts.user) {
        requestedUser = await userUtil.GetUserFriendly(opts.user);

        if (!requestedUser) {
            msg.channel.send(`${opts.user} does not exist!`);
            return;
        }
    }

    let serverPlaycount = await db.get("scores").count({
        chartID: chart.chartID
    });

    let yourPlaycount = await db.get("scores").count({
        userID: user.id,
        chartID: chart.chartID,
    });

    let sr = await db.get("scores").findOne({
        chartID: chart.chartID
    }, {
        sort: {
            "scoreData.percent": -1
        }
    });

    let yourPB = await db.get("scores").findOne({
        chartID: chart.chartID,
        userID: user.id,
        isScorePB: true
    });

    let yourPBField = {
        name: `${user.displayname}'s PB`,
        value: "Not Played.",
        inline: true
    }

    let fields = [];

    if (yourPB){
        if (!yourPB.isLampPB) {
            let lampPB = await db.get("scores").findOne({
                chartID: chart.chartID,
                userID: user.id,
                isLampPB: true
            });
    
            yourPB.scoreData.lamp = lampPB.scoreData.lamp;
            yourPB.scoreData.lampIndex = lampPB.scoreData.lampIndex;
        }

        yourPBField = {
            name: `${user.displayname}'s PB`,
            value: `[${user.displayname} (@${user.username})](https://kamaitachi.xyz/dashboard/users/${user.id}/games/${yourPB.game}?playtype=${chart.playtype})\n[${FormatScore(yourPB)}](https://kamaitachi.xyz/dashboard/scores/${yourPB.scoreID})`,
            inline: true
        }
    }

    fields.push(yourPBField);

    if (requestedUser) {
        let reqPB = await db.get("scores").findOne({
            chartID: chart.chartID,
            userID: requestedUser.id,
            isScorePB: true
        });

        if (reqPB) {
            if (!reqPB.isLampPB) {
                let lampPB = await db.get("scores").findOne({
                    chartID: chart.chartID,
                    userID: user.id,
                    isLampPB: true
                });
        
                reqPB.scoreData.lamp = lampPB.scoreData.lamp;
                reqPB.scoreData.lampIndex = lampPB.scoreData.lampIndex;
            }
    
            fields.push({
                name: `${requestedUser.displayname}'s PB`,
                value: `[${requestedUser.displayname} (@${requestedUser.username})](https://kamaitachi.xyz/dashboard/users/${requestedUser.id}/games/${reqPB.game}?playtype=${chart.playtype})\n[${FormatScore(reqPB)}](https://kamaitachi.xyz/dashboard/scores/${reqPB.scoreID})`,
                inline: true
            });
        }
        else {
            fields.push({
                name: `${requestedUser.displayname}'s PB`,
                value: `Not played.`,
                inline: true
            });
        }
    }

    let srField = {
        name: "Server Record",
        value: "No Plays!",
        inline: true
    }

    if (sr) {
        let srHolder = await userUtil.GetUserWithID(sr.userID);
        srField = {
            name: "Server Record",
            value: `[${srHolder.displayname} (@${srHolder.username})](https://kamaitachi.xyz/dashboard/users/${sr.userID}/games/${sr.game}?playtype=${chart.playtype})\n[${FormatScore(sr)}](https://kamaitachi.xyz/dashboard/scores/${sr.scoreID})`,
            inline: true
        }
    }

    fields.push(srField);

    fields.push(...[{
        name: `${user.displayname}'s Playcount`,
        value: yourPlaycount,
        inline: false
    }, {
        name: "Server Playcount",
        value: serverPlaycount,
        inline: false
    }]);

    if (requestedUser) {
        let reqPlaycount = await db.get("scores").count({
            chartID: chart.chartID,
            userID: requestedUser.id
        });

        fields.push({
            name: `${requestedUser.displayname}'s Playcount`,
            value: reqPlaycount,
            inline: false
        })
    }

    let infoEmbed = new Discord.MessageEmbed()
        .setColor("#cc527a")
        .setAuthor(
            `${config.gameHuman[song.game]}`,
        )
        .setThumbnail(`https://kamaitachi.xyz/static/images/gameicons/${song.game}/${song.firstAppearance}.png`)
        .setTitle(`${song.artist} - ${song.title} (${config.formatDifficulty(chart, song.game)} ${chart.level})`)
        .setURL(`https://kamaitachi.xyz/dashboard/games/${song.game}/songs/${song.id}?difficulty=${chart.difficulty}&playtype=${chart.playtype}`)
        .addFields(fields)

    msg.channel.send(infoEmbed);
}

module.exports = {
    desc: "Gets information about a chart.",
    args: [
        {
            required: true,
            val: ["title","artist","genre"]
        }
    ],
    opts: [
        {
            name: "game",
            desc: "Any supported game."
        },
        {
            name: "exact",
            desc: "Forces Kamaitachi to make an exact match of the title."
        },
        {
            name: "difficulty",
            desc: "Selects a chart with the selected difficulty."
        },
        {
            name: "playtype",
            desc: "Selects a chart with the selected playtype."
        },
        {
            name: "user",
            desc: "Displays information about a given user on the chart."
        }
    ],
    handler: ChartInfo
}