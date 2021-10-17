const Discord = require('discord.js');

const client = new Discord.Client();

const { prefix, token } = require('./config/bot.json')


const genticket = require('./commands/Tickets/genticket.js');
const boostticket = require('./commands/Tickets/boostticket.js');
const staffappticket = require('./commands/Tickets/staffappticket');
const setlog = require('./commands/Tickets/setlog');
const close = require('./commands/Tickets/close');
const _delete = require('./commands/Tickets/delete');
const rename = require('./commands/Tickets/rename');
const fs = require('fs')


client.once('ready', () => {

    console.log(`Property of Justin W.`);


    client.user.setActivity(`for !help `, { type: 'WATCHING' }).catch(console.error);

});

client.on('message', message => {

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (command === `${prefix}help`) {
        const embed = new Discord.MessageEmbed()
            .setTitle('**Help Page**')
            .addFields([
                { name: "Ticket Management", value: "-boostticket\n-genticket\n-repticket\n-staffticket\n-setticketlogs\n-close\n-delete\n-rename" },
                { name: "Ticket Commands", value: "-intro\n-done\n-paypal\n-\tos" },
                { name: "Others", value: "-setcurrency\n-settos" }
            ])

            .setTimestamp()
        message.channel.send(embed)
    }
    if (command === '-ping') {
        message.channel.send(` My ping is: ${Math.round(client.ws.ping)}ms`)
    }




})

client.on('message', message => {

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (command === `${prefix}intro`) {


        fs.readFile('config/bot.json', 'utf8', async (err, data) => {
            var botconfig = JSON.parse(data);
            if (!botconfig.tickets.includes(message.channel.id)) return message.channel.send('This is not a ticket!')

            if (!message.member.roles.cache.some(r => r.id === botconfig.supportID)) return message.channel.send('You dont have permissions.')



            const embed = new Discord.MessageEmbed()
                .setTitle(botconfig.introTitle)
                .setDescription(botconfig.introDesc)
                .setTimestamp()
            message.channel.send(embed)
        })

    } else if (command === `${prefix}done`) {


        fs.readFile('config/bot.json', 'utf8', async (err, data) => {
            if (!botconfig.tickets.includes(message.channel.id)) return message.channel.send('This is not a ticket!')
            var botconfig = JSON.parse(data);
            if (!message.member.roles.cache.some(r => r.id === botconfig.supportID)) return message.channel.send('You dont have permissions.')



            const embed = new Discord.MessageEmbed()
                .setTitle(botconfig.doneTitle)
                .setDescription(botconfig.doneDesc)
                .setTimestamp()
            message.channel.send(embed)
        })

    } else if (command === `${prefix}tos`) {


        fs.readFile('config/bot.json', 'utf8', async (err, data) => {
            if (!botconfig.tickets.includes(message.channel.id)) return message.channel.send('This is not a ticket!')
            var botconfig = JSON.parse(data);
            if (!message.member.roles.cache.some(r => r.id === botconfig.supportID)) return message.channel.send('You dont have permissions.')



            const embed = new Discord.MessageEmbed()
                .setTitle(`Please say 'I Agree' after reading our tos`)
                .setDescription(`<#${botconfig.tosChannel}>`)
                .setTimestamp()
            message.channel.send(embed)
        })

    } else if (command === `${prefix}settos`) {
        var channelID = args[0]
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('You do not have the permission to execute this command!')
        if (!channelID) return message.channel.send('Please provide a channel ID.');

        if (!message.guild.channels.cache.get(channelID)) return message.channel.send('That is not a channel!')
        fs.readFile('config/bot.json', 'utf8', (err, data) => {
            if (err) {
                console.log('Error in reading file bot.json from setlog.js' + err);
            }
            var botconfig = JSON.parse(data);
            botconfig.tosChannel = channelID
            fs.writeFileSync('config/bot.json', JSON.stringify(botconfig, null, 4), () => {


                if (err) {
                    message.channel.send(`Couldn\'t set the tos channel!`)


                }


            })

            message.channel.send(`Tos channel set to: **<#${botconfig.tosChannel}>**`)


        })

    } else if (command === `${prefix}setpaypal`) {
        var link = args[0]
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('You do not have the permission to execute this command!')
        if (!link) return message.channel.send('Please provide a channel ID.');


        fs.readFile('config/bot.json', 'utf8', (err, data) => {
            if (err) {
                console.log('Error in reading file bot.json from setlog.js' + err);
            }
            var botconfig = JSON.parse(data);
            botconfig.paypal = link
            fs.writeFileSync('config/bot.json', JSON.stringify(botconfig, null, 4), () => {


                if (err) {
                    message.channel.send(`Couldn\'t set the paypal link!`)


                }


            })

            message.channel.send(`Paypal link set to: **${link}**`)


        })

    } else if (command === `${prefix}paypal`) {
        const amt = args[0]
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('You do not have the permission to execute this command!')
        if (!amt) return message.channel.send('Please provide an amount.');


        fs.readFile('config/bot.json', 'utf8', (err, data) => {
            if (err) {
                console.log('Error in reading file bot.json from setlog.js' + err);
            }
            var botconfig = JSON.parse(data);







            const embed = new Discord.MessageEmbed()
                .setTitle('Paypal')
                .setDescription(`${botconfig.paypal} \n Please pay **${botconfig.currency}${amt}** to our paypal!`)

            message.channel.send(embed)


        })

    } else if (command === `${prefix}setcurrency`) {
        const currency = args[0]
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('You do not have the permission to execute this command!')
        if (!currency) return message.channel.send('Please a currency eg. $.');
 

        fs.readFile('config/bot.json', 'utf8', (err, data) => {
            if (err) {
                console.log('Error in reading file bot.json from setlog.js' + err);
            }
            var botconfig = JSON.parse(data);
            botconfig.currency = currency

            fs.writeFileSync('config/bot.json', JSON.stringify(botconfig, null, 4), () => {


                if (err) {
                    message.channel.send(`Couldn\'t set the paypal link!`)


                }


            })

            message.channel.send(`Currency set to ${currency}`)


        })

    }

})
boostticket(client)
genticket(client)
staffappticket(client)
setlog(client)
close(client)
_delete(client)
rename(client)


client.login(token)