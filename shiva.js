const fs = require('fs');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const config = require('./config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.User,
    Partials.Message,
    Partials.GuildMember,
    Partials.ThreadMember,
  ],
});

// Komut dosyalarını yükle
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = new Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

// Yardım komutunu eklemek için
const yardimCommand = require('./commands/yardım.js');
commands.set(yardimCommand.name, yardimCommand);

// REST tanımı
const rest = new REST({ version: '10' }).setToken(config.token);

// async işlevini kullanarak bir örnek işlev tanımlayalım
async function main() {
  try {
    // REST isteğini gerçekleştir
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands.map(cmd => ({
      name: cmd.name,
      description: cmd.description
    }))});
    console.log('[SHİVA COMMANDS] YÜKLENDİ ✅');

    console.log('Bot durumu güncellendi.');
  } catch (error) {
    console.error(error);
  }
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const command = commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu!', ephemeral: true });
  }
});

client.login(config.token)
  .then(() => {
    console.log('Bot ismi ile giriş yapıldı.');
    console.log('Bot kullanıcı adı:', client.user.username);
    // main fonksiyonunu burada çağırın
    main();

    client.user.setPresence({
      activities: [{ name: 'Twitch Yayını', type: 'STREAMING', url: 'https://twitch.tv/kanaladi' }], // Twitch yayını yapıyor olarak ayarla
      status: 'dnd', // Durumu rahatsız etmeyin olarak ayarla
    });    
  })
  .catch(console.error);
