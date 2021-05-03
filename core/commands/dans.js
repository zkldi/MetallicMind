module.exports = {
    desc: "Informs the user about dans.",
    args: [],
    secret: true,
    opts: {},
    handler: async (mind, msg, args, opts) => {
        await msg.channel.send("Do not play dans.")
    }
}