const fetch = require("node-fetch");
const config = require("../../config.js");
const userUtil = require("../../util/users.js");
const Discord = require("discord.js");

async function ScoreQuery(mind, msg, args){
    let user = await userUtil.RequireLinkAndSecureInfo(msg);
    if (!user) {
        return;
    }

    let rj = await fetch("http://api.kamaitachi.xyz/v1/scores?limit=10&getAssocData=true&" + args.slice(1).join(" "), {
        headers: {
            Authorization: `Bearer ` + user.integrations["ktchi-api"].key
        }
    }).then(r => r.json());

    if (!rj.success) {
        msg.channel.send(rj.description);
        return;
    }

    let fields = [];

    let users = new Map();
    let songs = new Map();
    let charts = new Map();

    for (const u of rj.body.users) {
        users.set(u.id, u);
    }

    for (const game in rj.body.songs) {
        for (const s of rj.body.songs[game]) {
            songs.set(`${game}-${s.id}`, s);
        }
    }

    for (const game in rj.body.charts) {
        for (const c of rj.body.charts[game]) {
            charts.set(`${game}-${c.chartID}`, c);
        }
    }


    for (const score of rj.body.items) {
        let song = songs.get(score.game + "-" + score.songID);
        let chart = charts.get(score.game + "-" + score.chartID);
        let user = users.get(score.userID);

        let scoreVal = `${score.scoreData.percent.toFixed(2)}% [${score.scoreData.score}]\n${score.scoreData.grade} / ${score.scoreData.lamp}`;

        let field = {
            name: `${song.title} (${config.formatDifficulty(chart, score.game)} ${chart.level}) ${user.displayname}`,
            value: `[${scoreVal}](https://kamaitachi.xyz/dashboard/scores/${score.scoreID})`,
            inline: true
        }

        fields.push(field);
    }

    let scoresEmbed = new Discord.MessageEmbed()
        .setColor("#cc527a")
        .setTitle(`Score Query Results`)
        .addFields(fields);

    msg.channel.send(scoresEmbed);
}

module.exports = {
    desc: "Performs a score query.",
    args: [
        {
            required: false,
            val: "querystring"
        }
    ],
    opts: [

    ],
    handler: ScoreQuery
}