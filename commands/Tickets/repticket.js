const Discord = require('discord.js');

const client = new Discord.Client();

const {prefix, token, supportID} = require('../../config/bot.json')

const {repPanelTitle,repPanelDesc,repTicketTitle, repTicketDesc  } = require('../../config/repticket.json')

const fs = require('fs')
const ticket = require('../../ticket.js')

module.exports = (client) => {



    client.on('message', async message => {

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);

        if(command === `${prefix}repticket`){
            var botconfig = JSON.parse(data);

            fs.readFile('config/bot.json', 'utf8', async (err, data) => {
            if (!message.member.roles.cache.some(r => r.id === botconfig.supportID)) return message.channel.send('You dont have permissions.')
            const embed = new Discord.MessageEmbed()
            .setTitle(repPanelTitle)
            .setDescription(repPanelDesc)

            const msg =  await message.channel.send(embed);

            msg.react('🎫');

            fs.readFile('config/repticket.json', 'utf8', (err, data) => {
                if (err) {
                    console.log("Error reading file from disk:", err);
                    return;
                  }
                  console.log(data);
            try {
                const repTicket = JSON.parse(data);
                repTicket.channelID = msg.id;
                fs.writeFile('config/repticket.json', JSON.stringify(repTicket, null, 4), () => {
                    console.log(repTicket)
                })
           
              } catch (err) {
                console.log("Error parsing JSON string:", err);
              }
            })
        })
        }

    })

    client.on("messageReactionAdd", async (reaction, user) => {

        fs.readFile('config/repticket.json', 'utf8', async (err, data) => {
            if (err) {
                console.log("Error reading file from disk:", err);
                return;

            }
            var repTicket = JSON.parse(data);
            if (reaction.message.id == repTicket.channelID && reaction.count > 1) {
                var client = user
                reaction.users.remove(client.id)


                repTicket.ticketNumber++

                fs.writeFileSync('config/repticket.json', JSON.stringify(repTicket, null, 4), () => {

                })

                

                const ticketChannel = await reaction.message.guild.channels.create(`ticket ${repTicket.ticketNumber}`, {
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
                    .setTitle(repTicketTitle)
                    .setDescription(repTicketDesc)
                ticketChannel.send(embed)
                ticketChannel.send(`<@${user.id}>`)
                const t = new ticket(staffTicket.ticketNumber, 'Report', user.id, ticketChannel)


                fs.readFile('config/bot.json', 'utf8', (err, data) => {
                    if (err) {
                        console.log('Error in reading file bot.json from setlog.js' + err);
                    }
                    var botconfig = JSON.parse(data);
                    botconfig.tickets.push(ticketChannel.id)
                    fs.writeFileSync('config/bot.json', JSON.stringify(botconfig, null, 4), () => {

                    })

                    const t = new ticket(repTicket.ticketNumber, 'Report', user.id, ticketChannel.id)
    
                   
                    const log = new Discord.MessageEmbed()
                        .setTitle('Ticket Opened')
                        .addFields(
                            { name: 'Type', value: 'Report', inline: true },
                            { name: "Number", value: `ticket-${repTicket.ticketNumber}`, inline: true },
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