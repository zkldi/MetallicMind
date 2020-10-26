const GetSong = require("./get-song.js");
const db = require("../db.js");

async function GetChart(user, msg, args, opts) {
    let song = await GetSong(user, msg, args, opts);

    if (!song) {
        return;
    }

    let chartQueryObj = {
        id: song.id
    };

    if (opts.playtype) {
        chartQueryObj.playtype = opts.playtype;
    }

    if (opts.difficulty) {
        chartQueryObj.difficulty = opts.difficulty;
    }

    let charts = await db.get(`charts-${song.game}`).find(chartQueryObj);

    return {song, charts};
}

module.exports = GetChart;