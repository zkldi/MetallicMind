const db = require("../../db.js");
const config = require("../../config.js");
const LooseMatch = require("../../util/loose-match.js");
const userUtil = require("../../util/users.js");

async function LastSession(mind, msg, args){
    let user = await userUtil.GetRequestingUser(msg);

    if (!user) {
        msg.channel.send("You are not `!link`ed with Kamaitachi!");
        return;
    }

    let queryObj = {
        userID: user.id
    };

    if (args[1]) { // game
        let match = LooseMatch(args[1], config.supportedGames);
        if (match) {
            queryObj.game = match;
        }
        else {
            msg.channel.send("Unknown argument for game. Valid values are: " + config.supportedGames.join(", "));
            return;
        }

        if (args[2]) { // playtype
            let ptMatch = LooseMatch(args[2], config.validPlaytypes[queryObj.game]);
            if (ptMatch) {
                queryObj.playtype = ptMatch;
            }
            else {
                msg.channel.send("Unknown argument for playtype. Valid values are: " + config.validPlaytypes[queryObj.game].join(", "));
                return;
            }
        }
    }

    let session = await db.get("sessions").findOne(queryObj, {
        sort: {
            timeStarted: -1
        }
    });

    if (!session) {
        msg.channel.send("No session found.");
        return;
    }

    msg.channel.send(`${global.BASE_URL}/dashboard/sessions/view/${session.sessionID}`);
}

module.exports = {
    desc: "Gets your last session.",
    secret: false,
    args: [{
        required: false,
        val: ["game"]
    }, {
        required: false,
        val: ["playtype"]
    }],
    opts: {
        
    },
    handler: LastSession
}