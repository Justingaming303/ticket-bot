const Discord = require('discord.js');

const client = new Discord.Client();

const { prefix, token, logChannel, closedTicketsCategory, supportID } = require('../../config/bot.json')



const fs = require('fs');
const { channel } = require('diagnostics_channel');





module.exports = (client) => {




    client.on('message', message => {

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);
        if (command === `${prefix}close`) {
            fs.readFile('config/bot.json', 'utf8', async (err, data) => {

                var botconfig = JSON.parse(data);
                if (message.channel.parent == closedTicketsCategory) return message.channel.send('Ticket is already closed!')
                if (!botconfig.tickets.includes(message.channel.id)) return message.channel.send('This is not a ticket!')
                if (!message.member.roles.cache.some(r => r.id === botconfig.supportID)) return message.channel.send('You dont have permissions.')

                const log = new Discord.MessageEmbed()
                    .setTitle('Ticket Closed')
                    .addFields(
                        { name: 'Action', value: 'Closed' },
                        { name: "Number", value: `${message.channel.name}`, inline: true },
                        { name: "Channel", value: `<#${message.channel.id}>`, inline: true }
                    )
                    .setTimestamp()



                fs.readFile('config/bot.json', 'utf8', (err, data) => {

                    if (err) {
                        console.log(err);
                    }

                    var botconfig = JSON.parse(data)

                    var logc = message.guild.channels.cache.get(botconfig.logChannel)
                    var tc = message.guild.channels.cache.get(botconfig.transcripts)



                    message.channel.setParent("893102019341070366", { lockPermissions: false }).then(channel =>
                        logc.send(log)


                    )

                    message.channel.overwritePermissions([
                        {
                            id: message.guild.id,
                            deny: "VIEW_CHANNEL"
                        },
                        {
                            id: supportID,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"]
                        }

                    ])


                    var i = botconfig.tickets.indexOf(message.channel.id);
                    botconfig.tickets.splice(i, 1);

                    fs.writeFileSync('config/bot.json', JSON.stringify(botconfig, null, 4), () => {
                        message.channel.send('Ticket closed successfully.');
                    })


                    fs.readFile(`tickets/${message.channel.name}.json`, 'utf8', function (err, data) {



                        const ticket = JSON.parse(data)
                        const


                            collector = message.channel.createMessageCollector();

                        collector
                            .on('end', () => {

                            //  var t =   ticket.chat.map(message =>
                            //         `${message.author.tag}-${message.author.id} at ` +
                            //         `${message.timestamp}: ${message.content}\n${message.embeds.join(`\n`)}`

                          var chat = ticket.chat.map(getChat)

                            function getChat(item) {
                                    
                                 return item.usertag+ ' - ' + item.userid + ' - ' +item.timestamp +  ' : ' + item.content + '\n'
                                  
                                
                                

                            }
                             
                                
                            
                                   fs.writeFile(`transcripts/transcript-${message.channel.name}.txt`, chat.join(""), () => {
                                    const attachments = new Discord.MessageAttachment(`transcripts/transcript-${message.channel.name}.txt`)
                                    const embed = new Discord.MessageEmbed()
                                
                                    .setTitle(`transcript-${message.channel.name}`) 
                                    
                                
                                    tc.send(embed)
                                    tc.send(attachments)

                                    fs.unlink(`tickets/${message.channel.name}.json`, () => {

                                        fs.unlink(`transcripts/transcript-${message.channel.name}.txt` , () => {
                                            message.channel.send('Logged successfully.')
                                        })
                                    })
                                 
                                   })
                                    
                            })


                            collector.stop()


                            
                           
                    })

                })


            })



        }



    })


}