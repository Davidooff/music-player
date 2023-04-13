const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const UserModel = require('../../../config/models/user')
const QueueModel = require('../../../config/models/queue')
const soundcloud = require('../../soundcloud')
const playList = require('../../play-lists')
const end = require('./player-events/end')

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
        if (!voiceChannel) { // Check if the user is in a voice channel
            return interaction.reply({
                content: 'You need to be in a voice channel to use this command!',
                ephemeral: true
            });
        }


        
        let lib = await playList.getLibrary(login)
        console.log(lib);
        if (!lib) {
            return interaction.reply({
                content: 'Cant find library',
                ephemeral: true
            });
        }
        
        try {
            await QueueModel.deleteOne({_id: interaction.guild.id})
        } catch {
            console.log('No quen');
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
        player.addListener("stateChange", async (oldOne, newOne) => {
            if (newOne.status == "idle") {
                console.log('end');
                let next = await playList.shiftQueue(interaction.guild.id)
                end(player, interaction.guild.id, next)
            }   
        });
        soundcloud.streamURL(lib[0].link, stream => {
            const resource = createAudioResource(stream);
            connection.subscribe(player);
            player.play(resource);
        })
        
        interaction.reply(JSON.stringify(lib[0]))
        // Play the audio
        
        // Send a message to confirm the audio is playing
        // const embed = new MessageEmbed()
        //     .setColor('BLUE')
        //     .setDescription(`Now playing: ${url}`);
        // interaction.reply({ embeds: [embed] });       
    },
};