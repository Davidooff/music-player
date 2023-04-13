const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const UserModel = require('../../../config/models/user')
const QueueModel = require('../../../config/models/queue')
const soundcloud = require('../../soundcloud')
const playList = require('../../play-lists')
const end = require('./player-events/end')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip audio from a lib'),
    async execute(interaction) {
        let next = await playList.shiftQueue(interaction.guild.id)

        const player = createAudioPlayer()
        if (!next) {
            try{
                const connection = getVoiceConnection(interaction.guild.id)
                connection.unsubscribe()
            } finally{
                return interaction.reply('No music in lib')
            }
        }
        interaction.reply(JSON.stringify(next))
        const connection = getVoiceConnection(interaction.guild.id)

        soundcloud.streamURL(next.link, (stream) => {
            const resource = createAudioResource(stream);
            connection.subscribe(player);
            player.play(resource);
            // interaction.reply('Now playing: ' + lib.queue[0])
        })
        player.addListener("stateChange", async (oldOne, newOne) => {
            if (newOne.status == "idle") {
                console.log('end');
                let next = await playList.shiftQueue(interaction.guild.id)
                end(player, interaction.guild.id, next)
            }   
        });
    }, 
};