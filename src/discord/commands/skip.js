const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const UserModel = require('../../../config/models/user')
const QueueModel = require('../../../config/models/queue')
const soundcloud = require('../../soundcloud')
const end = require('./player-events/end')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip audio from a lib'),
    async execute(interaction) {
        let lib = await QueueModel.findById(interaction.guild.id).exec();
        lib.queue.shift();
        await lib.save()
        const player = createAudioPlayer()
        if (lib.queue.length == 0 ) {
            try{
                const connection = getVoiceConnection(interaction.guild.id)
                connection.unsubscribe()
            } finally{
                return interaction.reply('No music in lib')
            }
        }
        const connection = getVoiceConnection(interaction.guild.id)

        soundcloud.streamURL(lib.queue[0].link, (stream) => {
            const resource = createAudioResource(stream);
            connection.subscribe(player);
            player.play(resource);
            interaction.reply('Now playing: ' + lib.queue[0])
        })
        player.addListener("stateChange", async (oldOne, newOne) => {
            if (newOne.status == "idle") {
                console.log('end');
                let lib = await QueueModel.findById(interaction.guild.id).exec();
                lib.queue.shift();
                await lib.save()
                end(player, interaction.guild.id)
            }   
        });
    }, 
};