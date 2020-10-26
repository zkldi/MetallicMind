const db = require("../db.js");

const SECURE_USER_OPTS = {
    projection: {
        integrations: 0,
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

async function GetRequestingUserAndSecureInfo(msg){
    let user = await db.get("users").findOne({
        "integrations.discord.discordID": msg.author.id
    });

    return user;
}

async function RequireLink(msg) {
    let user = await GetRequestingUser(msg);
    if (!user) {
        msg.channel.send("You are not `!link`ed with Kamaitachi!");
    }

    return user;
}

async function RequireLinkAndSecureInfo(msg) {
    let user = await GetRequestingUserAndSecureInfo(msg);
    if (!user) {
        msg.channel.send("You are not `!link`ed with Kamaitachi!");
    }

    return user;
}

async function GetUserWithID(id) {
    let user = await db.get("users").findOne({
        id: id
    }, SECURE_USER_OPTS);

    return user;
}

module.exports = {
    GetUserFriendly,
    GetRequestingUser,
    RequireLink,
    RequireLinkAndSecureInfo,
    GetRequestingUserAndSecureInfo,
    GetUserWithID
}