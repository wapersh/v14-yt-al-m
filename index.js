const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();

fs.readdirSync("./commands").filter(file => file.endsWith(".js")).forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});

client.once("ready", () => {
    console.log(`${client.user.tag} olarak giriş yapıldı.`);

    // Yayın yapıyor durumu
    client.user.setPresence({
        activities: [{
            name: "Wapers",
            type: 1, // Yayın yapıyor
            url: "https://www.twitch.tv/lcsfr"
        }],
        status: "online" // Yeşil durum
    });
});

client.on("messageCreate", async message => {
    if (!message.content.startsWith(".") || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(client, message, args, config);
    } catch (error) {
        console.error(error);
        message.reply("Bir hata oluştu.");
    }
});

// Bot tokenini buraya yazmayı unutma
client.login("DİSCORD BOT TOKEN");
