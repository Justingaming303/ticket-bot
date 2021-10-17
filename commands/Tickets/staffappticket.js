const Discord = require('discord.js');

const client = new Discord.Client();

const { prefix, token , supportID} = require('../../config/bot.json')

const { staffPanelTitle, staffPanelDesc, staffTicketTitle, staffTicketDesc } = require('../../config/staffappticket.json')

const fs = require('fs')
const ticket = require('../../ticket.js')
module.exports = (client) => {



    client.on('message', async message => {

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);


        if (command === `${prefix}staffticket`) {
            var botconfig = JSON.parse(data);
            fs.readFile('config/bot.json', 'utf8', async (err, data) => {
            if (!message.member.roles.cache.some(r => r.id === botconfig.supportID)) return message.channel.send('You dont have permissions.')
            const embed = new Discord.MessageEmbed()
                .setTitle(staffPanelTitle)
                .setDescription(staffPanelDesc)

            const msg = await message.channel.send(embed);

            msg.react('🎫');

            fs.readFile('config/staffappticket.json', 'utf8', (err, data) => {
                if (err) {
                    console.log("Error reading file from disk:", err);
                    return;
                }
                console.log(data);
                try {
                    const staffTicket = JSON.parse(data);
                    staffTicket.channelID = msg.id;
                    fs.writeFile('config/staffappticket.json', JSON.stringify(staffTicket, null, 4), () => {
                        console.log(staffTicket)
                    })

                } catch (err) {
                    console.log("Error parsing JSON string:", err);
                }
            })
        })

        }

    })
    client.on("messageReactionAdd", async (reaction, user) => {

        fs.readFile('config/staffappticket.json', 'utf8', async (err, data) => {
            if (err) {
                console.log("Error reading file from disk:", err);
                return;

            }
            var staffTicket = JSON.parse(data);
            if (reaction.message.id == staffTicket.channelID && reaction.count > 1) {
                var client = user
                reaction.users.remove(client.id)
                console.log(this.ticketNumber);

                staffTicket.ticketNumber++

                fs.writeFileSync('config/staffappticket.json', JSON.stringify(staffTicket, null, 4), () => {

                })

               
               
                
               var ticketChannel = await reaction.message.guild.channels.create(`ticket ${staffTicket.ticketNumber}`, {
                    type: 'TEXT',
                    parent: parentCategory,
                    permissionOverwrites:
                        [
                            {
                                id: reaction.message.guild.id,
                                deny: "VIEW_CHANNEL"
                            },
                            {
                                id: user.id,
                                allow: "VIEW_CHANNEL"
                            },


                            {
                                id: supportID,
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"]
                            }

                        ]


                })
                
                
                const embed = new Discord.MessageEmbed()
                    .setTitle(staffTicketTitle)
                    .setDescription(staffTicketDesc)
                ticketChannel.send(embed)
                ticketChannel.send(`<@${user.id}>`)
                const t = new ticket(staffTicket.ticketNumber, 'Staff Application', user.id, ticketChannel)







                fs.readFile('config/bot.json', 'utf8', (err, data) => {
                    if (err) {
                        console.log('Error in reading file bot.json from setlog.js' + err);
                    }
                    var botconfig = JSON.parse(data);

                    botconfig.tickets.push(ticketChannel.id)
                    fs.writeFileSync('config/bot.json', JSON.stringify(botconfig, null, 4), () => {

                    })
                    const t = new ticket(staffTicket.ticketNumber, 'Staff Application', user.id, ticketChannel.id)
    
                   
                    const log = new Discord.MessageEmbed()
                        .setTitle('Ticket Opened')
                        .addFields(
                            { name: 'Type', value: 'Staff Application', inline: true },
                            { name: "Number", value: `ticket-${staffTicket.ticketNumber}`, inline: true },
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



            }
        })

    })





}