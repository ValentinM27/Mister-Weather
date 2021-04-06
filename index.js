const Discord = require('discord.js');
const fs = require('fs');

const {token, tokenapi} = require("./config.json")
const axios = require('axios')

const client = new Discord.Client();

client.login(token);
client.on("ready", () => {
    console.log("Started.")
    client.user.setStatus("online")
    client.user.setActivity("/plshelp", {
        type: "STREAMING",
        url: "https://twitch.tv/#"
    });
});

client.on("message", message => {
    if(!message.guild) return 
    let args = message.content.trim().split(/ +/g)
    if(args[0].toLocaleLowerCase() === "/plshelp"){
        var dateNow = new Date()
        message.delete();

        message.reply({embed: {
            color: 3447003,
            author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
            },
            title: "MisterWeather",
            description: "Je peux vous donner la météo",
            fields: [{
                name: "/weather",
                value: "/weather @location \n Pour des villes à nom composé: \n mettre des -, exemple: salon-de-provence"
            }],
            timestamp: dateNow,
            footer: {
                icon_url: client.user.avatarURL,
                text: "© Valentin MARGUERIE"
            }
        }})
    }
})

client.on("message", message => {
    if(!message.guild) return 
    let args = message.content.trim().split(/ +/g)
    if(args[0].toLocaleLowerCase() === "/weather"){
        var dateNow = new Date()
        var city = args[1];
        message.delete();
        axios
            .get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${tokenapi}&lang=fr`)
            .then(response => {
                let apiData = response;
                var condition1 = apiData.data.weather[0].description
                var currentTemp = Math.ceil(apiData.data.main.temp)
                var cityName = city.toUpperCase();
                var country = apiData.data.sys.country
                
                message.channel.send({embed: {
                    color: 3447003,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL()
                    },
                    title: "MisterWeather",
                    description: "Voici votre bulletin météo",
                    fields: [{
                        name: cityName+", "+country,
                        value: condition1+", il fait "+currentTemp+" °C" 
                    }],
                    timestamp: dateNow,
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: "© Valentin MARGUERIE"
                    }
                }});
            })
            .catch(err => {
                message.reply("Entrez un ville valide")
            })
    }
})