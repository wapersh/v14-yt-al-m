const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ytk",
    async execute(client, message, args, config) {
        const emojiYes = "<a:wapers_yes:1388905393081679903>";
        const emojiNo = "<a:wapers_no:1388905396688916612>";

        let isAdmin = message.member.permissions.has("Administrator");
        let userCategories = [];

        // Yetkili olduğu kategorileri topla
        if (!isAdmin) {
            Object.entries(config.categories).forEach(([key, cat]) => {
                if (message.member.roles.cache.some(r => cat.rolesCanGive.includes(r.id))) {
                    userCategories.push(key);
                }
            });

            if (userCategories.length === 0) {
                return message.reply(`${emojiNo} Bu komutu kullanmaya yetkin yok.`);
            }
        }

        // Verebileceği rolleri hazırla
        let infoList = [];
        let totalRoles = 0;

        Object.entries(config.categories).forEach(([key, cat]) => {
            if (isAdmin || userCategories.includes(key)) {
                const roleNames = cat.assignRoles
                    .map(r => {
                        const role = message.guild.roles.cache.get(r);
                        return role ? `・${role.name}` : null;
                    })
                    .filter(Boolean)
                    .join("\n");
                infoList.push(`> **__${cat.name}__**\n${roleNames}`);
                totalRoles += cat.assignRoles.length;
            }
        });

        const embedInfo = new EmbedBuilder()
            .setTitle("Yetki Bilgilendirmesi")
            .setDescription(
                `> **${message.member.displayName}**, aşağıdaki yetkilere sahipsin:\n\n` +
                infoList.join("\n\n") +
                `\n\nToplam verebileceğin yetki: **${totalRoles} adet**` +
                `\n${isAdmin ? "> 🔹 **Yönetici olduğun için tüm rolleri verebilirsin.**" : ""}`
            )
            .setColor("#2f3136")
            .setFooter({ text: "Yetki Sistemi • .ytk Komutu" });

        const infoMsg = await message.reply({ embeds: [embedInfo] });

        // Kullanıcı belirtmesini iste
        const questionMsg = await message.reply(`Lütfen yetki vermek istediğin kullanıcıyı etiketle veya ID'sini yaz.`);

        // Cevap bekle
        const collected = await message.channel.awaitMessages({
            filter: m => m.author.id === message.author.id,
            max: 1,
            time: 30000
        }).catch(() => null);

        // Süre dolarsa mesajları sil
        if (!collected || collected.size === 0) {
            await questionMsg.delete().catch(() => {});
            await infoMsg.delete().catch(() => {});
            return message.reply(`${emojiNo} Süre doldu, işlem iptal edildi.`).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        }

        const replyMsg = collected.first();
        const member = replyMsg.mentions.members.first() || await message.guild.members.fetch(replyMsg.content).catch(() => null);
        if (!member) return message.reply(`${emojiNo} Kullanıcı bulunamadı.`);

        if (!member.roles.cache.has(config.requiredRole))
            return message.reply(`${emojiNo} Kullanıcının üzerinde **Family of Dark** rolü yok.`);

        // Kullanıcının sahip olduğu en yüksek yetki rolü
        const sortedRoleIds = Object.keys(config.categories)
            .sort((a, b) => Number(a) - Number(b))
            .flatMap(k => config.categories[k].assignRoles);

        const targetHighestRoleIndex = sortedRoleIds.findIndex(roleId => member.roles.cache.has(roleId));

        // Verebileceği rolleri listele
        let rolesToShow = [];
        Object.entries(config.categories).forEach(([key, cat]) => {
            if (isAdmin || userCategories.includes(key)) {
                cat.assignRoles.forEach(rid => {
                    rolesToShow.push({
                        roleId: rid,
                        category: cat.name
                    });
                });
            }
        });

        if (rolesToShow.length === 0)
            return message.reply(`${emojiNo} Verebileceğin rol bulunamadı.`);

        if (rolesToShow.length > 25) rolesToShow = rolesToShow.slice(0, 25);

        const menu = new StringSelectMenuBuilder()
            .setCustomId(`ytk_select_${member.id}`)
            .setPlaceholder("Verilecek yetkiyi seçiniz")
            .addOptions(
                rolesToShow.map(r => {
                    const role = message.guild.roles.cache.get(r.roleId);
                    return {
                        label: role ? role.name : "Bilinmiyor",
                        description: `Kategori: ${r.category}`,
                        value: r.roleId
                    };
                })
            );

        const row = new ActionRowBuilder().addComponents(menu);

        const embedSelect = new EmbedBuilder()
            .setDescription(`**${member}** kullanıcısına verilecek yetkiyi seçin:`)
            .setColor("#2f3136");

        const msg = await message.reply({ embeds: [embedSelect], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async interaction => {
            if (interaction.user.id !== message.author.id)
                return interaction.reply({ content: `${emojiNo} Bu menüyü sadece komutu kullanan seçebilir.`, ephemeral: true });

            const selectedRoleId = interaction.values[0];
            const selectedRoleIndex = sortedRoleIds.findIndex(rid => rid === selectedRoleId);

            // Hedef kişinin rolü daha üstse engelle
            if (targetHighestRoleIndex !== -1 && selectedRoleIndex <= targetHighestRoleIndex) {
                return interaction.update({
                    content: `${emojiNo} Kullanıcının üzerinde zaten daha yüksek veya aynı seviyede bir rol var.`,
                    components: [],
                    embeds: []
                });
            }

            const selectedRole = message.guild.roles.cache.get(selectedRoleId);
            if (!selectedRole)
                return interaction.update({ content: `${emojiNo} Seçilen rol bulunamadı.`, components: [], embeds: [] });

            try {
                await member.roles.add(selectedRole);
                if (Array.isArray(config.extraRoles) && config.extraRoles.length > 0) {
                    await member.roles.add(config.extraRoles).catch(() => {});
                }
            } catch {
                return interaction.update({ content: `${emojiNo} Rol eklenirken bir hata oluştu.`, components: [], embeds: [] });
            }

            const logChannel = message.guild.channels.cache.get(config.logChannel);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle("Yetki Verildi")
                    .addFields(
                        { name: "Yetki Veren", value: message.author.toString(), inline: true },
                        { name: "Yetki Alan", value: member.toString(), inline: true },
                        { name: "Verilen Rol", value: selectedRole.toString(), inline: true }
                    )
                    .setColor("DarkGrey")
                    .setTimestamp();
                logChannel.send({ embeds: [logEmbed] });
            }

            await interaction.update({ content: `${emojiYes} **${selectedRole.name}** ve ek roller verildi.`, embeds: [], components: [] });
            collector.stop();
        });

        collector.on("end", collected => {
            if (collected.size === 0) {
                msg.edit({ content: `${emojiNo} Süre doldu, işlem iptal edildi.`, embeds: [], components: [] });
            }
        });
    }
};
