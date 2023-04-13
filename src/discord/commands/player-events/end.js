const { createAudioResource } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const QueueModel = require('../../../../config/models/queue')
const soundcloud = require('../../../soundcloud');

async function end(player, guildID, next, msg){
    let queue
    if (next) {
        queue = next
    } else{
        queue = await QueueModel.findById(guildID).lean().queue[0]
    }

    const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(queue.originalName)
        .setURL(queue.link)
        // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription('Platform: ' + queue.platform)
        .setThumbnail('https://media.discordapp.net/attachments/992797049701552180/1026821354978291873/DiscordMusic.gif')
        .setTimestamp()
        // .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    
    msg.edit({embeds: [exampleEmbed]})
    if (queue && queue.link) {
        soundcloud.streamURL(queue.link, (stream) => {
            let resource = createAudioResource(stream)
            player.play(resource)
        })
    } else{
        msg.edit("You don't have music in you're librery any more");
    }
}

module.exports = end;