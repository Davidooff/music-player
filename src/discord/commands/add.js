const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const QueueModel = require('../../../config/models/queue')
const playList = require('../../play-lists')
const scdl = require('soundcloud-downloader').default

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
        let { title } = await scdl.getInfo(URL)
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(title)
            .setURL(URL)
            // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription('Added to queue')
            .setThumbnail('https://media.discordapp.net/attachments/992797049701552180/1026821354978291873/DiscordMusic.gif')
            .setTimestamp()
            // .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        
        interaction.reply({embeds: [exampleEmbed]})
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) { // Check if the user is in a voice channel
            return interaction.reply({
                content: 'You need to be in a voice channel to use this command!',
                ephemeral: true
            });
        }
        
        await playList.addToQueue(interaction.guild.id, URL, title, "SoundCloud")

	},
};
