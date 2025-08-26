module.exports = {
    name: "ytçek",
    async execute(client, message, args, config) {
        const emojiYes = "<a:wapers_yes:1388905393081679903>";
        const emojiNo = "<a:wapers_no:1388905396688916612>";

        const allowedRoles = config.allowedRolesForYtCek || [];

        if (!message.member.permissions.has("Administrator") && !message.member.roles.cache.some(r => allowedRoles.includes(r.id))) {
            return message.reply(`${emojiNo} Bu komutu kullanmaya yetkin yok.`);
        }

        if (!args[0]) return message.reply(`${emojiNo} Kullanıcı belirtmelisin.`);
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply(`${emojiNo} Kullanıcı bulunamadı.`);

        let found = false;
        Object.values(config.categories).forEach(cat => {
            cat.assignRoles.forEach(roleId => {
                if (member.roles.cache.has(roleId)) {
                    found = true;
                    member.roles.remove(roleId).catch(() => {});
                }
            });
        });

        if (!found) return message.reply(`${emojiNo} Kullanıcının yetki rolü yok.`);

        try {
            await member.roles.remove(config.extraRoles).catch(() => {});
            return message.reply(`${emojiYes} Yetkiler alındı.`);
        } catch {
            return message.reply(`${emojiNo} Yetkiler alınırken hata oluştu.`);
        }
    }
};
