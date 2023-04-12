const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const QueueModel = require('../../../config/models/queue')
const end = require('../commands/player-events/end')
const soundcloud = require('../../soundcloud')

async function skip(guildID){
    const conection = getVoiceConnection(guildID);
    const player = createAudioPlayer();
    player.addListener("stateChange", async (oldOne, newOne) => {
        if (newOne.status == "idle") {
            console.log('end');
            let model = await QueueModel.findById(guildID).exec();
            model.queue.shift();
            await model.save()
            end(player, guildID)
        }   
    });
    conection.subscribe(player)
    let model = await QueueModel.findById(guildID).exec();
    model.queue.shift();
    await model.save()
    let lib = model.queue
    lib = lib.queue
    if(lib){
        console.log(lib);
        soundcloud.streamURL(lib[0].link, stream => {
            const resource = createAudioResource(stream);
            player.play(resource)
        })
    }

}

module.exports = skip;