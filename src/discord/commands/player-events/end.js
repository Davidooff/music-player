const { createAudioResource } = require('@discordjs/voice');
const QueueModel = require('../../../../config/models/queue')
const soundcloud = require('../../../soundcloud');

async function end(player, guildID, next){
    let quen
    if (next) {
        quen.queue[0] = next
    } else{
        quen = await QueueModel.findById(guildID).lean()
    }
    if (quen.queue[0] && quen.queue[0].link) {
        soundcloud.streamURL(quen.queue[0].link, (stream) => {
            let resource = createAudioResource(stream)
            player.play(resource)
        })
    } else{
        console.log("You don't have music in you're librery any more");
    }
}

module.exports = end;