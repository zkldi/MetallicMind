// redis style ICP wrote by hazel.
const redis = require("redis");

const redisPub = redis.createClient();
const redisSub = redis.createClient();

const subs = {}

function pub(channel, data) {
    redisPub.publish(channel, JSON.stringify(data));
}

function sub(channel, callback) {
    if (!subs[channel]) {
        subs[channel] = [callback];
        redisSub.subscribe(channel);
    }
    else {
        subs[channel].push(callback);
    }
}

redisSub.on("message", (channel, raw_data) => {
    if (!(channel in subs)) {
        return;
    }

    try {
        const data = JSON.parse(raw_data);
        for (let callback of subs[channel]) {
            callback(data);
        }
    } catch(e) {
        console.log(e)
    }
});

module.exports = {pub, sub}