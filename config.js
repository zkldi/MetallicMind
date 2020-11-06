module.exports = {
    ver: {
        title: "All I Need",
        major: 1,
        minor: 4,
        patch: 0,
        suffix: "a"
    },
    gameChannels: {
        "iidx": "687614242089730059",
        "bms": "692887005016883210",
        "sdvx": "687614296867471370",
        "ddr": "692879592653848618",
        "popn": "687614263287611434",
        "maimai": "687614289556668417",
        "museca": "687614252067848196",
        "chunithm": "768579004788637756",
        "jubeat": "687614313514795119",
        "gitadora": "768579058460000337"
    },
    supportedGames: ["iidx","museca","maimai","jubeat","popn","sdvx","ddr","bms","chunithm","gitadora"],
    validPlaytypes: {
        iidx: ["SP","DP"],
        popn: ["9B"],
        sdvx: ["Single"],
        ddr: ["SP","DP"],
        maimai: ["Single"],
        jubeat: ["Single"],
        museca: ["Single"],
        bms: ["7K","14K","5K","10K"],
        chunithm: ["Single"],
        gitadora: ["Gita", "Dora"]
    },
    validDifficulties: {
        iidx: ["BEGINNER", "NORMAL", "HYPER", "ANOTHER", "LEGGENDARIA"],
        museca: ["Green", "Yellow", "Red"],
        maimai: ["Easy", "Basic", "Advanced", "Expert", "Master", "Re:Master"],
        jubeat: ["BSC","ADV","EXT"],
        popn: ["Easy", "Normal", "Hyper", "EX"],
        sdvx: ["NOV", "ADV", "EXH", "MXM", "INF", "GRV", "HVN", "VVD"],
        ddr: ["BEGINNER", "BASIC", "DIFFICULT", "EXPERT", "CHALLENGE"],
        bms: ["BEGINNER", "NORMAL", "HYPER", "ANOTHER", "CUSTOM"],
        chunithm: ["BASIC", "ADVANCED", "EXPERT", "MASTER", "WORLD'S END"],
        gitadora: ["BASIC", "ADVANCED", "EXTREME", "MASTER", "BASS BASIC", "BASS ADVANCED", "BASS EXTREME", "BASS MASTER"]
    },
    gameHuman: {
        iidx: "beatmania IIDX",
        museca: "MÚSECA",
        maimai: "maimai",
        sdvx: "SOUND VOLTEX",
        ddr: "Dance Dance Revolution",
        gitadora: "GITADORA",
        gfdm: "GuitarFreaks & DrumMania",
        jubeat: "jubeat",
        popn: "pop'n music",
        bms: "BMS",
        chunithm: "CHUNITHM"
    },
    serviceSupportedGames: { // only used for sync.
        ARC: ["iidx","jubeat","sdvx","ddr"],
        FLO: ["iidx"],
        EAG: ["iidx"],
    },
    formatDifficulty: function (chart, game) {
        if (this.validPlaytypes[game].length === 1) {
            return chart.difficulty;
        }
        else {
            return chart.playtype + " " + chart.difficulty
        }
    },
    prefix: "!"
}