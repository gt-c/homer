const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');

class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      category: 'general',
      usage: '[user]',
      dm: true,
    });
  }

  async execute(context) {
    const search = context.args.join(' ');
    let user = context.message.author;
    if (search && context.message.guild) {
      const foundMembers = this.client.finder.findMembers(context.message.guild.members, search);
      if (!foundMembers || foundMembers.length === 0) return context.replyError(context.__('finderUtil.findMembers.zeroResult', { search }));
      if (foundMembers.length === 1) user = foundMembers[0].user;
      else if (foundMembers.length > 1) return context.replyWarning(this.client.finder.formatMembers(foundMembers, context.settings.misc.locale));
    }

    const embed = new RichEmbed()
      .setImage(user.displayAvatarURL);

    context.reply(
      context.__('avatar.title', {
        name: `**${user.username}**#${user.discriminator}`,
      }),
      { embed },
    );
  }
}

module.exports = AvatarCommand;
