const discordjs = require('discord.js');

const ytdl = require('ytdl-core');
const yts = require('yt-search');

//Queue
const queue = new Map();

//loop variable
var loop = false;

module.exports = {
    async play(message,song){

        //Verificar se o utilizador está num canal de voz
        const canal = message.member.voice.channel;
        if(!canal){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                    .setDescription(`Eu canto não escrevo... Vai para um canal de voz`)
            return message.channel.send(reply);
        }

        //Verificar as permissões do utilizador
        const permissoes = canal.permissionsFor(message.client.user);
        if(!permissoes.has('CONNECT') || !permissoes.has('SPEAK')){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                    .setDescription(`E a autorização para tocar onde está?`)
            return message.channel.send(reply)
        }

        //Queue do servidor
        const server_queue = queue.get(message.guild.id);

        //Verificar ser há música
        if(!song.length){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                    .setDescription(`Preciso do nome da música`)
            return message.channel.send(reply);
        }

        let song_data = {}
        //Verificar se é um link
        if(ytdl.validateURL(song)){
            const song_info = await ytdl.getInfo(song);
            song_data = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url };
        }else{
            //Pesquisar no youtube
            console.log(song)
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#f1ca89')
                                                .setTitle('A pesquisar')
                                                .setDescription(`${song}`)
            message.channel.send(reply);
            const song_info  = await yts(song);
            
            if(song_info.all.length > 1){
                const result = song_info.all[0];
                song_data = { title: result.title, url: result.url, thumbnail: result.thumbnail, duration: result.duration};
            }else{
                var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                        .setColor('#cf0000')
                                                .setDescription(`Escolhe uma que de facto exista`)
                                                .setFooter(`E boa de preferência`)
                return message.channel.send(reply);
            }
        }

        //Verificar se existe uma queue, se não cria uma nova
        if(!server_queue){
            const queue_constructor = {
                canal: canal,
                text_channel: message.channel,
                connection: null,
                songs: []
            }

            //Adicionar a queue ao nosso servidor
            queue.set(message.guild.id, queue_constructor);
            queue_constructor.songs.push(song_data);

            //Ligar ao canal de voz e fazer play
            try {
                const connection = await canal.join();
                queue_constructor.connection = connection;
                video_player(message.guild, queue_constructor.songs[0]);
            } catch (err) {
                queue.delete(message.guild.id);
                var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                        .setColor('#cf0000')
                                                .setDescription(`Não consegui conectar-me ao canal`)
                message.channel.send(reply);
                throw err;
            }
        }else{
            const espera = server_queue.songs.length;
            var duration = String(song_data.duration);
            server_queue.songs.push(song_data);
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#c6ffc1')
                                                    .setTitle(`**${song_data.title}**`)
                                                    .setDescription(`Duração: **${duration}**`)
                                                    .setThumbnail(song_data.thumbnail)
                                                    .setFooter(`Adicionada - Tens ${espera} músicas à frente`);

            server_queue.connection.dispatcher.resume();
            return message.channel.send(reply);
        }
    },
    async pause(message){
        //Queue do servidor
        const server_queue = queue.get(message.guild.id);

        if (!message.member.voice.channel){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Queres mandar, tens de estar no canal`)
            return message.channel.send(reply);
        }
        if(!server_queue){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Não está a dar nada`)
            return message.channel.send(reply);
        }
        server_queue.connection.dispatcher.pause();
    },
    async resume(message){
        //Queue do servidor
        const server_queue = queue.get(message.guild.id);

        if (!message.member.voice.channel){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Queres mandar, tens de estar no canal`)
            return message.channel.send(reply);
        }
        if(!server_queue){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Não está a dar nada`)
            return message.channel.send(reply);
        }
        server_queue.connection.dispatcher.resume();
    },

    async skip(message){
        //Queue do servidor
        const server_queue = queue.get(message.guild.id);

        if (!message.member.voice.channel){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Queres mandar, tens de estar no canal`)
            return message.channel.send(reply);
        }
        if(!server_queue){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Não está a dar nada`)
            return message.channel.send(reply);
        }
        server_queue.connection.dispatcher.end();
    },

    async stop(message){
        //Queue do servidor
        const server_queue = queue.get(message.guild.id);

        if (!message.member.voice.channel){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Queres mandar, tens de estar no canal`)
            return message.channel.send(reply);
        }
        if(!server_queue){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Não está a dar nada`)
            return message.channel.send(reply);
        }
        server_queue.songs = [];
        server_queue.connection.dispatcher.end();
        return;
    },

    async seek(message,time){
        //Queue do servidor
        const server_queue = queue.get(message.guild.id);

        if (!message.member.voice.channel){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Queres mandar, tens de estar no canal`)
            return message.channel.send(reply);
        }
        if(!server_queue){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Não está a dar nada`)
            return message.channel.send(reply);
        }
        video_player(message.guild,server_queue.songs[0],time)

        
        return;
    },

    async loop(message){
        loop = !loop;
        var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#c6ffc1')
                                                .setDescription(`O loop está ${loop ? "ligado":"desligado"}`)
            return message.channel.send(reply);
    },

    async playlist(message){
        //Queue do servidor
        const server_queue = queue.get(message.guild.id);

        if (!message.member.voice.channel){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Queres mandar, tens de estar no canal`)
            return message.channel.send(reply);
        }
        if(!server_queue){
            var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#cf0000')
                                                .setDescription(`Não está a dar nada`)
            return message.channel.send(reply);
        }

        let info = '';
        server_queue.songs.forEach(song => {
            info += `-  ${song.title}\n\n`
        });


        var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#233e8b')
                                                    .setTitle("Playlist")
                                                .setDescription(info)
            return message.channel.send(reply);
    }
    
}

const video_player = async (guild, song,time) => {
    const song_queue = queue.get(guild.id);

    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        song_queue.canal.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    
    song_queue.connection.play(stream, { seek: time ? time:0, volume: 0.5 })
    .on('finish', () => {
        if(loop){
            console.log(song_queue.songs[0])
            song_queue.songs.push(song_queue.songs[0]);
        }
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
    });
    var duration = String(song.duration).split('(')[1].replace(')','');

    if(time){
        var timestamp = '';
        var temp_m = time/60;
        timestamp += Math.floor(temp_m) +':';
        timestamp += time - (Math.floor(temp_m)*60);

        var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                                    .setColor('#c6ffc1')
                                                    .setTitle(`**${song.title}**`)
                                                    .setDescription(`${timestamp} / **${duration}**`)
                                                    .setThumbnail(song.thumbnail)
                                                    .setFooter(`A tocar`);
    }else{
        var reply = new discordjs.MessageEmbed().setAuthor('Quim Bot')
                                            .setColor('#c6ffc1')
                                            .setTitle(`**${song.title}**`)
                                            .setDescription(`Duração: **${duration}**`)
                                            .setThumbnail(song.thumbnail)
                                            .setFooter('A tocar')
    }
    

           
    await song_queue.text_channel.send(reply)
}

