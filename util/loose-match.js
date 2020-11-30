function LooseMatch(item, array) {
    for (const val of array) {
        if (item.match(new RegExp(`^${val}$`, "i"))) {
            return val;
        }
    }

    return null;
}

module.exports = LooseMatch;
