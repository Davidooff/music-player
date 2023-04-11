const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const UserModel = require('../../../config/models/user')
const QueueModel = require('../../../config/models/queue')
const soundcloud = require('../../soundcloud')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play audio from a lib')
        .addStringOption(option => 
            option.setName('login')
            .setDescription("Enter you're login to play lib")
            .setRequired(true)),
    async execute(interaction) {
        // console.log(generateDependencyReport());  // -- check DependencysX
        const login = interaction.options.getString('login');
        const voiceChannel = interaction.member.voice.channel;
        // Check if the user is in a voice channel


        if (!voiceChannel) {
            return interaction.reply({
                content: 'You need to be in a voice channel to use this command!',
                ephemeral: true
            });
        }
        
        let lib = await UserModel.findById(login).lean();
        lib = lib.library
        console.log(lib);
        if (!lib) {
            return interaction.reply({
                content: 'Cant find library',
                ephemeral: true
            });
        }
        interaction.reply(JSON.stringify(lib[0]))

        let quen = await QueueModel.findById(interaction.guild.id)

        if (quen) {
            await quen.deleteOne()
        }
        await QueueModel.create({
            '_id': interaction.guild.id,
            'channelId': voiceChannel.id,
            'queue': lib
        })

        // Join the voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        // Create an audio player and resource
        const player = createAudioPlayer();
        player.addListener("stateChange", (oldOne, newOne) => {
            let model = QueueModel.findById(interaction.guild.id)
            model.queue.shift();
        });
        soundcloud.streamURL(lib[0].link, stream => {
            const resource = createAudioResource(stream);
            connection.subscribe(player);
            player.play(resource);
        })

        // Play the audio

        // Send a message to confirm the audio is playing
        // const embed = new MessageEmbed()
        //     .setColor('BLUE')
        //     .setDescription(`Now playing: ${url}`);
        // interaction.reply({ embeds: [embed] });
    },
};