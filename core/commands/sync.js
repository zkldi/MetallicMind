const fetch = require("node-fetch");
const config = require("../../config.js");
const userUtil = require("../../util/users.js");
const crypto = require("crypto");
const db = require("../../db.js");

async function SyncScores(mind, msg, args){
    let user = await userUtil.GetRequestingUserAndSecureInfo(msg);

    if (!user) {
        return;
    }

    if (!args[1]){
        msg.channel.send("No service provided!");
    }

    args[1] = args[1].toUpperCase();

    if (!["FLO","EAG"].includes(args[1])){
        msg.channel.send(`${args[1]} is not a supported service.`);
        return;
    }

    if (!args[2]){
        msg.channel.send(`No game provided!`);
        return;
    }

    if (!config.serviceSupportedGames[args[1]].includes(args[2])) {
        msg.channel.send(`${args[1]} does not support ${args[2]}. Supported games are ${config.serviceSupportedGames[args[1]].join(", ")}`);
        return;
    }

    let apikey = crypto.randomBytes(20).toString("hex");
    // generate a temporary auth key
    await db.get("internal-api-keys").insert({
        apikey: apikey,
        assignedTo: user.id,
        expiryTime: Date.now() + (1000 * 60 * 5), // 5 mins
        createdOn: Date.now(),
        createdBy: "mmind",
    })

    msg.channel.send(`Firing import request...`);
    let importRes = await fetch("https://kamaitachi.xyz/dashboard/data/import", {
        method: "PATCH",
        body: JSON.stringify({
            serviceLoc: args[1],
            gameLoc: args[2],
            apikey: apikey
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    try {
        let rj = await importRes.json();

        if (rj.success) {
            msg.channel.send(`Successfully imported ${rj.body.successfulScoreCount} Score(s).\nGenerated ${rj.body.sessionInfo ? rj.body.sessionInfo.length : 0} new sessions.`);
        }
        else {
            msg.channel.send(rj.description);
        }
    }
    catch (err) {
        console.error(importRes);
        msg.channel.send("Internal Server Error (lmao)");
    }

    // and disable the key immediately after.
    await db.get("internal-api-keys").remove({
        apikey: apikey
    });
}

module.exports = {
    desc: "Imports scores from services with integrations, this is equivalent to doing a score import.",
    args: [
        {
            required: true,
            val: ["FLO","EAG"]
        },
        {
            required: true,
            val: "game"
        }
    ],
    opts: {
        
    },
    handler: SyncScores
}