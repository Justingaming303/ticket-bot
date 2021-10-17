const Discord = require('discord.js');

const client = new Discord.Client();

const { prefix, token, logChannel, closedTicketsCategory , supportID} = require('../../config/bot.json')


const fs = require('fs')





module.exports = (client) => {




    client.on('message', message => {

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);
        if (command === `${prefix}rename`) {

         
                fs.readFile('config/bot.json', 'utf8', async (err, data) => {
    
                    var botconfig = JSON.parse(data);
                    if (!botconfig.tickets.includes(message.channel.id)) return message.channel.send('This is not a ticket!')
                    if (!message.member.roles.cache.some(r => r.id === botconfig.supportID)) return message.channel.send('You dont have permissions.')
            var oldName = message.channel.name
            var newName = args[0]
            const log = new Discord.MessageEmbed()
                .setTitle('Ticket Renamed')
                .addFields(
                    { name: 'Action', value: 'Renamed' },
                    { name: "Number", value: `${message.channel.name}`, inline: true },
                    { name: "Channel", value: `<#${message.channel.id}>`, inline: true },
                    {name: "Name", value: `${oldName} to ${newName}`, inline: true },
                )
                .setTimestamp()
            


            fs.readFile('config/bot.json', 'utf8', (err, data) => {

                if (err) {
                    console.log(err);
                }

                var botconfig = JSON.parse(data)

                var logc = message.guild.channels.cache.get(botconfig.logChannel)

                message.channel.setName(newName)

                    logc.send(log)
                message.channel.send('Renamed successfully.')

                




            })
        })
        }


    
    
    
    

    })


}