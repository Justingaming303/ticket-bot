const Discord = require('discord.js');

const client = new Discord.Client();

const { prefix, token, logChannel } = require('../../config/bot.json')
const fs = require('fs');

module.exports = (client) => {



    client.on('message', (message) => {


        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);

        if (command === `${prefix}setticketlogs`) {
            var channelID = args[0]
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('You do not have the permission to execute this command!')
            if (!channelID) return message.channel.send('Please provide a channel ID.');
           
            if(!message.guild.channels.cache.get(channelID)) return message.channel.send('That is not a channel!')
            fs.readFile('config/bot.json', 'utf8', (err, data) => {
                if (err) {
                    console.log('Error in reading file bot.json from setlog.js' + err);
                }
                var botconfig = JSON.parse(data);
                botconfig.logChannel = channelID
                fs.writeFileSync('config/bot.json', JSON.stringify(botconfig, null, 4), () => {


                    if (err) {
                        message.channel.send(`Couldn\'t set the log channel!`)


                    }


                })

                message.channel.send(`Ticket log channel set to: **<#${botconfig.logChannel}>**`)


            })

        }



    })


}