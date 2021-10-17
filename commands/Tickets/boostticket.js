const Discord = require('discord.js');

const client = new Discord.Client();

const { prefix, token, logChannel , supportID} = require('../../config/bot.json')

const { boostPanelTitle, boostPanelDesc, boostTicketTitle, boostTicketDesc, channelID, parentCategory,  ticketNumber } = require('../../config/boostticket.json')

const fs = require('fs')
const ticket = require('../../ticket.js');
const { json } = require('express');




module.exports = (client) => {



    client.on('message', async message => {

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);


        if (command === `${prefix}boostticket`) {

fs.readFile('config/bot.json', 'utf8', async (err, data) => {

    var botconfig = JSON.parse(data);

    if (!message.member.roles.cache.some(r => r.id === botconfig.supportID)) return message.channel.send('You dont have permissions.')
            const embed = new Discord.MessageEmbed()
                .setTitle(boostPanelTitle)
                .setDescription(boostPanelDesc)

            const msg = await message.channel.send(embed);

            msg.react('🎫');






            fs.readFile('config/boostticket.json', 'utf8', (err, data) => {
                if (err) {
                    console.log("Error reading file from disk:", err);
                    return;

                }
                var boostTicket = JSON.parse(data);
                boostTicket.channelID = msg.id;
                fs.writeFile('config/boostticket.json', JSON.stringify(boostTicket, null, 4), () => {

                })
            })
})
            


        }



    })

    client.on("messageReactionAdd", async (reaction, user) => {

        fs.readFile('config/boostticket.json', 'utf8', async (err, data) => {
            if (err) {
                console.log("Error reading file from disk:", err);
                return;

            }
            var boostTicket = JSON.parse(data);
            if (reaction.message.id == boostTicket.channelID && reaction.count > 1) {
               var client = user
                reaction.users.remove(client.id)



                boostTicket.ticketNumber++

                fs.writeFileSync('config/boostticket.json', JSON.stringify(boostTicket, null, 4), () => {

                })



                const ticketChannel = await reaction.message.guild.channels.create(`ticket ${boostTicket.ticketNumber}`, {
                    type: 'TEXT',
                    parent: parentCategory,
                    permissionOverwrites:
                        [
                            {
                                id: reaction.message.guild.id,
                                deny: "VIEW_CHANNEL"
                            },
                            {
                                id: client.id,
                                allow: "VIEW_CHANNEL"
                            },


                            {
                                id: supportID,
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"]
                            }

                        ]


                })

                const embed = new Discord.MessageEmbed()
                    .setTitle(boostTicketTitle)
                    .setDescription(boostTicketDesc)
                ticketChannel.send(embed)
                ticketChannel.send(`<@${user.id}>`)
 //ticket log start

                fs.readFile('config/bot.json', 'utf8', (err, data) => {
                    if (err) {
                        console.log('Error in reading file bot.json from setlog.js' + err);
                    }
                    var botconfig = JSON.parse(data);
                    botconfig.tickets.push(ticketChannel.id)

                    fs.writeFileSync('config/bot.json', JSON.stringify(botconfig, null, 4), () => {

                    })
                    const t = new ticket(boostTicket.ticketNumber, 'Booster', user.id, ticketChannel.id)
    
                   
                    const log = new Discord.MessageEmbed()
                        .setTitle('Ticket Opened')
                        .addFields(
                            { name: 'Type', value: 'Booster', inline: true },
                            { name: "Number", value: `ticket-${boostTicket.ticketNumber}`, inline: true },
                            { name: "Customer", value: `<@${client.id}>`, inline: true},
                            { name: "Channel", value: `<#${ticketChannel.id}>`, inline: true }
                        )
                        .setTimestamp()
                    var logc = reaction.message.guild.channels.cache.get(botconfig.logChannel)
                    logc.send(log)
    
                })
                try {

                    
                    const
                   
                        transcript = [],
                        collector = ticketChannel.createMessageCollector(message => !message.author.bot);
                        var tran = {
                            chat : []
                        }
                    collector
                            .on('collect', (message) => {

                                

                             var newChat = {
                                    'content': message.content,
                                    'userid': message.author.id, 
                                    'usertag': message.author.tag,
                                    'timestamp': message.createdAt.toLocaleString(),
                                    'embeds': message.embeds.map((embed, index) => {
                                        `Embed ${(index+1)}:\nTitle: ${embed.title}\n` +
                                        `Author: ${embed.author}:\nContent: ${embed.description}\n` +
                                        `URL: ${embed.url}`
                                    })

                                }

                                tran.chat.push(newChat);
          

        
                                
              fs.writeFile(`tickets/${message.channel.name}.json`, JSON.stringify(tran) ,() => {


            })
                                
                                })
                            } catch (err) {
                                console.log(err);
                                console.log('error found1')
                            }


                           
                   
                //ticket log end

                            


            }
        
        })

    })
   






}

