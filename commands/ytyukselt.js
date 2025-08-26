module.exports = {
    name: "ytyukselt",
    async execute(client, message, args, config) {
        const emojiYes = "<a:wapers_yes:1388905393081679903>";
        const emojiNo = "<a:wapers_no:1388905396688916612>";

        const allowedRoles = config.allowedRolesForYtYukselt || [];

        // Yetki kontrol
        if (
            !message.member.permissions.has("Administrator") &&
            !message.member.roles.cache.some(r => allowedRoles.includes(r.id))
        ) {
            return message.reply(`${emojiNo} Bu komutu kullanmaya yetkin yok.`);
        }

        if (!args[0]) return message.reply(`${emojiNo} Kullanıcı belirtmelisin.`);
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply(`${emojiNo} Kullanıcı bulunamadı.`);

        // Tüm roller tek sıraya diz
        const sortedRoleIds = Object.keys(config.categories)
            .sort((a, b) => Number(a) - Number(b))
            .flatMap(key => config.categories[key].assignRoles);

        // Kullanıcının hangi role sahip olduğunu bul
        const currentRoleIndex = sortedRoleIds.findIndex(roleId => member.roles.cache.has(roleId));

        if (currentRoleIndex === -1)
            return message.reply(`${emojiNo} Kullanıcının yükseltilebilecek yetkisi bulunamadı.`);

        if (currentRoleIndex + 1 >= sortedRoleIds.length)
            return message.reply(`${emojiNo} Kullanıcı zaten en üst yetkide.`);

        const currentRoleId = sortedRoleIds[currentRoleIndex];
        const nextRoleId = sortedRoleIds[currentRoleIndex + 1];

        const oldRoleName = message.guild.roles.cache.get(currentRoleId)?.name || "Bilinmiyor";
        const newRoleName = message.guild.roles.cache.get(nextRoleId)?.name || "Bilinmiyor";

        try {
            await member.roles.remove(currentRoleId);
            await member.roles.add(nextRoleId);

            const logChannel = message.guild.channels.cache.get(config.logChannel);
            if (logChannel) {
                const { EmbedBuilder } = require("discord.js");
                const embed = new EmbedBuilder()
                    .setTitle("Yetki Yükseltildi")
                    .addFields(
                        { name: "Yükselten", value: message.author.toString(), inline: true },
                        { name: "Kullanıcı", value: member.toString(), inline: true },
                        { name: "Eski Yetki", value: oldRoleName, inline: true },
                        { name: "Yeni Yetki", value: newRoleName, inline: true }
                    )
                    .setColor("Blue")
                    .setTimestamp();
                logChannel.send({ embeds: [embed] });
            }

            return message.reply(`${emojiYes} Kullanıcı yükseltildi:\n**${oldRoleName} ➔ ${newRoleName}**`);
        } catch {
            return message.reply(`${emojiNo} Yükseltme sırasında bir hata oluştu.`);
        }
    }
};
