function ParseArgs(args) {
    let opts = {}

    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        if (arg.startsWith("--")) {
            let optInfo = arg.substring(2).split("=");
            let optName = optInfo[0];
            let optVal = optInfo[1];

            opts[optName] = optVal;

            args.splice(i, 1);

            i--; // hack? lol
        }
    }

    return {args, opts};
}

module.exports = ParseArgs