const Discord = require('discord.js');

const client = new Discord.Client();

const {prefix, token, supportID} = require('../../config/bot.json')

const {genPanelTitle,genPanelDesc,genTicketTitle, genTicketDesc, parentCategory } = require('../../config/genticket.json')

const ticket = require('../../ticket.js')
const fs = require('fs')

module.exports = (client) => {



    client.on('message', async message => {

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);

        if(command === `${prefix}genticket`){


fs.readFile('config/bot.json', 'utf8', async (err, data) => {

    var botconfig = JSON.parse(data);
            if (!message.member.roles.cache.some(r => r.id === botconfig.supportID)) return message.channel.send('You dont have permissions.')
            const embed = new Discord.MessageEmbed()
            .setTitle(genPanelTitle)
            .setDescription(genPanelDesc)

            const msg =  await message.channel.send(embed);

            msg.react('🎫');

            fs.readFile('config/genticket.json', 'utf8', (err, data) => {
                if (err) {
                    console.log("Error reading file from disk:", err);
                    return;
                  }
                  console.log(data);
            try {
                const genTicket = JSON.parse(data);
                genTicket.channelID = msg.id
                
                fs.writeFile('config/genticket.json', JSON.stringify(genTicket, null, 4), () => {
                    console.log(genTicket)
                })
           
              } catch (err) {
                console.log("Error parsing JSON string:", err);
              }
            })
        })
        }

    })
    client.on("messageReactionAdd", async (reaction, user) => {

        fs.readFile('config/genticket.json', 'utf8', async (err, data) => {
            if (err) {
                console.log("Error reading file from disk:", err);
                return;

            }
            var genTicket = JSON.parse(data);
            if (reaction.message.id == genTicket.channelID && reaction.count > 1) {
                var client = user
                reaction.users.remove(client.id)


                genTicket.ticketNumber++

                fs.writeFileSync('config/genticket.json', JSON.stringify(genTicket, null, 4), () => {

                })

                

                const ticketChannel = await reaction.message.guild.channels.create(`ticket ${genTicket.ticketNumber}`, {
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
                    .setTitle(genTicketTitle)
                    .setDescription(genTicketDesc)
                ticketChannel.send(embed)
                ticketChannel.send(`<@${user.id}>`)
                const t = new ticket(genTicket.ticketNumber, 'General', user.id, ticketChannel.id)

                fs.readFile('config/bot.json', 'utf8', (err, data) => {
                    if (err) {
                        console.log('Error in reading file bot.json from setlog.js' + err);
                    }
                    var botconfig = JSON.parse(data);
                    botconfig.tickets.push(ticketChannel.id)
                    fs.writeFileSync('config/bot.json', JSON.stringify(botconfig, null, 4), () => {

                    })

                    const t = new ticket(genTicket.ticketNumber, 'General', user.id, ticketChannel.id)
    
                   
                    const log = new Discord.MessageEmbed()
                        .setTitle('Ticket Opened')
                        .addFields(
                            { name: 'Type', value: 'General', inline: true },
                            { name: "Number", value: `ticket-${genTicket.ticketNumber}`, inline: true },
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




