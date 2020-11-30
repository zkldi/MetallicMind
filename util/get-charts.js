const GetSong = require("./get-song.js");
const db = require("../db.js");
const config = require("../config.js");
const LooseMatch = require("./loose-match.js");

async function GetChart(user, msg, args, opts) {
    let song = await GetSong(user, msg, args, opts);

    if (!song) {
        return {song: null, charts: null};
    }

    let chartQueryObj = {

        id: song.id
    };

    if (opts.playtype) {
        let match = LooseMatch(opts.playtype, config.validPlaytypes[song.game]);
        if (match) {
            chartQueryObj.playtype = match;
        }
        else {
            msg.channel.send("Invalid value for playtype. Valid values are: " + config.validPlaytypes[song.game].join(", "));
            return {song: null, charts: null};
        }
    }

    if (opts.difficulty) {
        let match = LooseMatch(opts.difficulty, config.validDifficulties[song.game]);
        if (match) {
            chartQueryObj.difficulty = match;
        }
        else {
            msg.channel.send("Invalid value for difficulty. Valid values are: " + config.validDifficulties[song.game].join(", "));
            return {song: null, charts: null};
        }
    }

    let charts = await db.get(`charts-${song.game}`).find(chartQueryObj);

    return {song, charts};
}

module.exports = GetChart;