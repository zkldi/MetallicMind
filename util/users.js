const db = require("../db.js");

const SECURE_USER_OPTS = {
    projection: {
        integrations: 0,
        _id: 0,
        password: 0,
        email: 0
    }
}

async function GetUserFriendly(id){
    let user;

    // possibly userID
    let intID = parseInt(id);
    if (intID) {
        user = await db.get("users").findOne({
            id: intID
        }, SECURE_USER_OPTS);
    }
    else {
        user = await db.get("users").findOne({
            username: id
        }, SECURE_USER_OPTS)
    }

    return user;
}

async function GetRequestingUser(msg){
    let user = await db.get("users").findOne({
        "integrations.discord.discordID": msg.author.id
    }, SECURE_USER_OPTS);

    return user;
}

module.exports = {
    GetUserFriendly,
    GetRequestingUser
}