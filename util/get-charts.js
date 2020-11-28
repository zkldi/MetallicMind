const GetSong = require("./get-song.js");
const db = require("../db.js");
const config = require("../config.js");

async function GetChart(user, msg, args, opts) {
    let song = await GetSong(user, msg, args, opts);

    if (!song) {
        return {song: null, charts: null};
    }

    let chartQueryObj = {

        id: song.id
    };

    if (opts.playtype) {
        for (const playtype of config.validPlaytypes[song.game]) {
            if (opts.playtype.match(new RegExp(`^${playtype}$`, "i"))) {
                chartQueryObj.playtype = playtype;
                break;
            }   
        }
    }

    if (opts.difficulty) {
        for (const difficulty of config.validDifficulties[song.game]) {
            if (opts.difficulty.match(new RegExp(`^${difficulty}$`, "i"))) {
                chartQueryObj.difficulty = difficulty;
                break;
            }
        }
    }

    let charts = await db.get(`charts-${song.game}`).find(chartQueryObj);

    return {song, charts};
}

module.exports = GetChart;