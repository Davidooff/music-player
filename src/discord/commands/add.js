const { SlashCommandBuilder } = require('discord.js');
const QueueModel = require('../../../config/models/queue')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add song to queu')
        .addStringOption(option => 
            option.setName('url')
            .setDescription("Enter you're url(soundcloud)")
            .setRequired(true)),
	async execute(interaction) {
		const URL = interaction.options.getString('url');

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) { // Check if the user is in a voice channel
            return interaction.reply({
                content: 'You need to be in a voice channel to use this command!',
                ephemeral: true
            });
        }
        await QueueModel.updateOne(
            { _id: interaction.guild.id }, 
            { 
                $push: { queue: {
                    'originalName': 'name',
                    'link': URL,
                    'platform': 'soundcloud'
                }} 
            },
            { upsert: true }
        );

	},
};
