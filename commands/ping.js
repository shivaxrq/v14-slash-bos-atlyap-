module.exports = {
    name: 'ping',
    description: 'Botun gecikme süresini ölçer.',
    execute(message, args) {
      const ping = Date.now() - message.createdTimestamp;
      message.reply(`Ping: ${ping}ms`);
    },
  };
  