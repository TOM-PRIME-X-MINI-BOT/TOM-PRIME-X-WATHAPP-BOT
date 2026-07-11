/**
 * Tag All Command - Stylish Mention All
 */

module.exports = {
    name: 'tagall',
    aliases: ['mentionall', 'everyone'],
    category: 'admin',
    description: 'Tag all group members',
    usage: '.tagall <message>',
    groupOnly: true,
    adminOnly: true,
    botAdminNeeded: true,

    async execute(sock, msg, args, extra) {
        try {
            const groupMetadata = extra.groupMetadata;
            const members = groupMetadata.participants;

            const emojis = [
                "│🌸 ᩧ𝆺ྀི𝅥",
                "│👑 ᩧ𝆺ྀི𝅥",
                "│🎀 ᩧ𝆺ྀི𝅥",
                "│🦋 ᩧ𝆺ྀི𝅥",
                "│💎 ᩧ𝆺ྀི𝅥",
                "│🎾 ᩧ𝆺ྀི𝅥",
                "│🎈 ᩧ𝆺ྀི𝅥",
                "│🧁 ᩧ𝆺ྀི𝅥",
                "│🍿 ᩧ𝆺ྀི𝅥",
                "│🪀 ᩧ𝆺ྀི𝅥"
            ];

            let notice = args.join(" ") || "💗 𝐀ᴛᴛᴇɴᴛɪᴏɴ 𝐄ᴠᴇʀʏᴏɴᴇ 💗";

            let text = `
⎯͢✧🫣 𝐆ʀᴏᴜᴘ 𝐓ᴀɢ 𝐀ʟʟ 🐱
⎯͢✧━━━━━━━━━━━━━━━✧
▢ 𝐆ʀᴏᴜᴘ : ${groupMetadata.subject}
▢ 𝐌ᴇᴍʙᴇʀ : ${members.length}
▢ 𝐍ᴏᴛɪᴄᴇ : ${notice}

╭┈─「 👑 𝐀ʟʟ 𝐌ᴇᴍʙᴇʀ𝐬 」┈❍
`;

            members.forEach((member, index) => {
                const emoji = emojis[index % emojis.length];
                text += `${emoji} @${member.id.split("@")[0]}\n`;
            });

            text += `
╰────────────❍

⎯͢✧━━━━━━━━━━━━━━━✧
💬 𝐒ᴇɴᴛ 𝐁ʏ : ⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱
💗 𝐒ᴛᴀʏ 𝐀ᴄᴛɪᴠᴇ • 𝐒ᴛᴀʏ 𝐒ᴛʏʟɪ𝐬ʜ ✨
⎯͢✧━━━━━━━━━━━━━━━✧
`;

            await sock.sendMessage(extra.from, {
                text,
                mentions: members.map(m => m.id)
            }, {
                quoted: msg
            });

        } catch (error) {
            console.error("TagAll Error:", error);

            await extra.reply("⎯͢✧❌ 𝐒ᴏʀʀʏ 𝐄ʀʀᴏʀ 🐱");
        }
    }
};
