const fetch = require("node-fetch");

async function GetSongHuman(user, msg, args, opts) {
    let rawQuery = encodeURIComponent(args.slice(1).join(" "));
    let query = rawQuery;

    let rj = await fetch("http://api.kamaitachi.xyz/v1/search/songs?title=" + encodeURIComponent(query), {
        headers: {
            Authorization: `Bearer ` + user.integrations["ktchi-api"].key
        }
    }).then(r => r.json());

    if (!rj.success) {
        msg.channel.send(rj.description);
        return null;
    }

    let songs = [];
    let exactMatches = [];

    if (opts.game) {
        songs = rj.body.matches[opts.game];
        exactMatches = rj.body.exactMatches[opts.game];

        if (exactMatches[0]) {
            exactMatches[0].game = opts.game;
            return exactMatches[0];
        }
    
        if (songs[0]) {
            songs[0].game = opts.game;
            return songs[0];
        }
    }
    else {
        for (const game in rj.body.matches) {
            songs.push(...rj.body.matches[game]);
            exactMatches.push(...rj.body.exactMatches[game]);

            if (exactMatches[0]) {
                exactMatches[0].game = game;
                return exactMatches[0];
            }
        
            if (songs[0]) {
                songs[0].game = game;
                return songs[0];
            }
        }
    }


    msg.channel.send("No song found.");
    return null;
}

module.exports = GetSongHuman;