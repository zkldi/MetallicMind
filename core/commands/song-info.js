const fetch = require("node-fetch");
const config = require("../../config.js");
const userUtil = require("../../util/users.js");
const Discord = require("discord.js");
const GetChartsHuman = require("../../util/get-charts.js");
const db = require("../../db.js");

async function SongInfo(mind, msg, args, opts){
    let user = await userUtil.RequireLinkAndSecureInfo(msg);
    if (!user) {
        return;
    }

    let {song, charts} = await GetChartsHuman(user, msg, args, opts);

    let fields = [{
        name: "GENRE",
        value: song.genre
    }];

    if (song["alt-titles"].length) {
        fields.push({
            name: "AKA",
            value: song["alt-titles"].join(", ")
        });
    }


    let chartField = {
        name: "Charts",
        value: ""
    };

    let cMap = new Map();

    for (const chart of charts) {
        cMap.set(`${chart.playtype}-${chart.difficulty}`, chart);
    }

    for (const playtype of config.validPlaytypes[song.game]) {
        for (const difficulty of config.validDifficulties[song.game]) {
            let chart = cMap.get(`${playtype}-${difficulty}`);

            if (chart) {
                chartField.value += `[${config.formatDifficulty(chart, song.game)} (${chart.level})](https://kamaitachi.xyz/dashboard/games/${song.game}/songs/${song.id}?playtype=${chart.playtype}&difficulty=${chart.difficulty})\n`
            }
        }
    }

    fields.push(chartField);

    let serverPlaycount = await db.get("scores").count({
        songID: song.id,
        game: song.game
    });

    let yourPlaycount = await db.get("scores").count({
        songID: song.id,
        userID: user.id,
        game: song.game
    });

    fields.push(...[{
        name: "Server Playcount",
        value: serverPlaycount
    }, {
        name: `Your Playcount (${user.displayname})`,
        value: yourPlaycount
    }]);

    let infoEmbed = new Discord.MessageEmbed()
        .setColor("#cc527a")
        .setAuthor(
            `${config.gameHuman[song.game]}`,
        )
        .setThumbnail(`https://kamaitachi.xyz/static/images/gameicons/${song.game}/${song.firstAppearance}.png`)
        .setTitle(`${song.artist} - ${song.title}`)
        .addFields(fields)

    msg.channel.send(infoEmbed);
}

module.exports = {
    desc: "Gets information about a song.",
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
            desc: "Limits chart results to the selected difficulty."
        },
        {
            name: "playtype",
            desc: "Limits chart results to the selected playtype."
        }
    ],
    handler: SongInfo
}