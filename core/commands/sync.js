const fetch = require("node-fetch");
const config = require("../../config.js");
const userUtil = require("../../util/users.js");
const crypto = require("crypto");
const db = require("../../db.js");

async function SyncScores(mind, msg, args){
    let user = await userUtil.GetRequestingUserAndSecureInfo(msg);

    if (!user) {
        msg.channel.send("You need to `!link` your account first!");
        return;
    }

    if (!args[1]){
        msg.channel.send("No service provided!");
        return;
    }

    args[1] = args[1].toUpperCase();

    if (args[1] === "ANTHEM") {
        msg.channel.send("Very funny.");
        return;
    }

    if (!args[2]){
        msg.channel.send(`No game provided!`);
        return;
    }


    args[2] = args[2].toLowerCase();

    if (!["FLO","EAG","ARC"].includes(args[1])){
        msg.channel.send(`${args[1]} is not a supported service.`);
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
    });

    let body = {
        serviceLoc: args[1],
        gameLoc: args[2],
        apikey: apikey
    };

    if (args[1] === "ARC") {
        let accs = user.integrations.arc && user.integrations.arc.accounts;

        if (!accs || !accs.length) {
            msg.channel.send("You have no ARC accounts linked!");
            return;
        }

        let filteredData = user.integrations.arc.accounts.filter(e => e.game === args[2]).sort((a,b) => parseInt(b.ver) - parseInt(a.ver));

        if (!filteredData[0]) {
            msg.channel.send("Could not find any appropriate ARC accounts to sync with!");
            return;
        }

        body.apiAccount = filteredData[0].accountID;
        msg.channel.send(`Attempting sync with ${filteredData[0].name}.`);
    }

    msg.channel.send(`Firing import request...`);
    let importRes = await fetch("https://kamaitachi.xyz/dashboard/data/import", {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    });

    try {
        let rj = await importRes.json();

        if (rj.success) {
            msg.channel.send(`Successfully imported ${rj.body.successfulScoreCount} Score(s).\nGenerated ${rj.body.sessionInfo ? rj.body.sessionInfo.length : 0} new sessions.\nLink: https://kamaitachi.xyz/dashboard/imports/view/${rj.body.importID}\n
            `);

            if (rj.body.sessionInfo.length && rj.body.sessionInfo.length <= 3) {
                let sArr = ["Remember to name your sessions!"];

                let i = 0;
                for (const s of rj.body.sessionInfo) {
                    i++;
                    sArr.push(`Session #${i}: https://kamaitachi.xyz/dashboard/sessions/view/${s}`);
                }

                msg.channel.send(sArr.join("\n"));
            }
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
            val: ["FLO","EAG","ARC"]
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