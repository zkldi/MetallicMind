const fetch = require("node-fetch");

async function GetSongHuman(user, msg, args, opts) {
    let rawQuery = encodeURIComponent(args.slice(1).join(" "));
    let query = rawQuery;

    if (opts.game) {
        query += "&game=" + opts.game;
    }

    if ("exact" in opts){
        query += "&exact=true";
    }

    let rj = await fetch("http://api.kamaitachi.xyz/v1/search?title=" + query, {
        headers: {
            Authorization: `Bearer ` + user.integrations["ktchi-api"].key
        }
    }).then(r => r.json());

    if (!rj.success) {
        msg.channel.send(rj.description);
        return null;
    }

    if (!rj.body[0]){
        msg.channel.send("No song found.");
    }

    return rj.body[0];
}

module.exports = GetSongHuman;