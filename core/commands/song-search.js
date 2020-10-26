const fetch = require("node-fetch");
const config = require("../../config.js");
const userUtil = require("../../util/users.js");
const Discord = require("discord.js");

async function SongSearch(mind, msg, args, opts){
    let user = await userUtil.RequireLinkAndSecureInfo(msg);
    if (!user) {
        return;
    }

    let query = encodeURIComponent(args.slice(1).join(" "));

    if (opts.game) {
        query += "&game=" + opts.game;
    }

    if (opts.exact || opts.exact === ""){
        query += "&exact=true";
    }

    let rj = await fetch("http://api.kamaitachi.xyz/v1/search?title=" + query, {
        headers: {
            Authorization: `Bearer ` + user.integrations["ktchi-api"].key
        }
    }).then(r => r.json());

    if (!rj.success) {
        msg.channel.send(rj.description);
        return;
    }

    let fields = [];

    for (const song of rj.body.slice(0, 10)) {
        let field = {
            name: `${song.artist} - ${song.title}`,
            value: `[${config.gameHuman[song.game]}](https://kamaitachi.xyz/dashboard/games/${song.game}/songs/${song.id})`,
            inline: true
        }

        fields.push(field);
    }

    if (!fields.length){
        fields = [{
            name: "No results found.",
            value: ":("
        }]
    }
    else if (fields.length === 10) {
        fields.push({
            name: "More Results",
            value: `[View](https://kamaitachi.xyz/dashboard/search?query=${query})`
        });
    }
    else {
        fields.push({
            name: "View on site",
            value: `[View](https://kamaitachi.xyz/dashboard/search?query=${query})`
        })
    }

    let scoresEmbed = new Discord.MessageEmbed()
        .setColor("#cc527a")
        .setTitle(`Searched for ${decodeURIComponent(query)}`)
        .addFields(fields)

    msg.channel.send(scoresEmbed);
}

module.exports = {
    desc: "Searches for a song.",
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
        }
    ],
    handler: SongSearch
}