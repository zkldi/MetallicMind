const config = require("../config.js");
const similarity = require("string-similarity");
const discord = require("discord.js");
const redisICP = require("../redisICP.js");
const ArgParse = require("../util/arg-parse.js");

const ICPHooks = {
    onAchievedGoal: require("./icp-hooks/achieved-goals.js")
}

const COMMANDS = {
    "status": require("./commands/status.js"),
    "link": require("./commands/link.js"),
    "profile": require("./commands/profile.js"),
    "scquery": require("./commands/query.js"),
    "search": require("./commands/song-search.js"),
    "songinfo": require("./commands/song-info.js"),
    "chartinfo": require("./commands/chart-info.js"),
    "sync": require("./commands/sync.js"),
    "help": {
        desc: "Displays a list of commands, or information about a specific command.",
        args: [
            {
                required: false,
                val: "command"
            }
        ],
        opts: [],
        handler: HelpFunction
    }
}

function FormatArguments(args) {
    let formattedArgs = "";
    for (const arg of args) {
        let inner;
        if (Array.isArray(arg.val)) {
            inner = arg.val.join("|");
        }
        else {
            inner = arg.val;
        }

        if (arg.required){
            inner = "[" + inner + "]";
        }
        else {
            inner = "<" + inner + ">";
        }

        formattedArgs += " " + inner;
    }

    return formattedArgs;
}

// HelpFunction is defined here and not in a separate file as it requires knowledge of COMMANDS to run.
function HelpFunction(mind, msg, args) {
    if (args[1]) {
        if (args[1] in COMMANDS && !COMMANDS[args[1]].secret) {
            let command = COMMANDS[args[1]];
            let formattedArgs = FormatArguments(command.args);

            msg.channel.send(`\`${args[1]}\`: ${command.desc}\nSyntax: \`${config.prefix}${args[1]}${formattedArgs}\``);
            if (command.opts.length) {
                let optString = "";
                for (const opt of command.opts) {
                    optString += `\n\`${opt.name}\`: ${opt.desc}`;
                }
                msg.channel.send(`Options: ${optString}`)
            }
        }
        else {
            msg.channel.send(`The function \`${args[1]}\` does not exist.`)
        }
    }
    else {
        let commandList = "";
        for (const command in COMMANDS) {
            commandList += `\`${command}\`: ${COMMANDS[command].desc}\n`;
        }

        msg.channel.send(commandList);
        msg.channel.send(`Invoke a command by typing \`${config.prefix}\` followed by the command name.\nAdd options using --name=value syntax.`);
    }
}

function InitialiseICP(mind){
    // now mount our own redis listeners for stuff.
    redisICP.sub("achieved-goals", (goal) => ICPHooks.onAchievedGoal(mind, goal));
}

function HandleMessage(mind, msg) {
    if (msg.content[0] === config.prefix) {
        let argsTemp = msg.content.substring(1).split(" ");
        let commandName = argsTemp[0];

        if (COMMANDS.hasOwnProperty(commandName)){
            let command = COMMANDS[commandName];

            let {args, opts} = ArgParse(argsTemp);
            command.handler(mind, msg, args, opts);
        }
        else {
            HandleInvalidCommand(mind, msg, commandName);
        }
    }
    // else, do nothing
}

function HandleInvalidCommand(mind, msg, commandName){
    let similar = [];
    for (const command in COMMANDS) {
        if (similarity.compareTwoStrings(commandName, command) > 0.25){
            similar.push(command);
        }
    }

    if (similar.length){
        if (similar.length > 1) {
            msg.channel.send(`Invalid command. Did you mean \`${similar.slice(0, similar.length - 1).join("`, `")}\`or \`${similar[similar.length - 1]}\`?`);
        }
        else {
            msg.channel.send(`Invalid command. Did you mean \`${similar[0]}\`?`);
        }
    }
    else {
        msg.channel.send(`Invalid command. (No similar commands found, either.)`);
    }
}

module.exports = {
    HandleMessage,
    InitialiseICP
}