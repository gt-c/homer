const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');

class ServerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'server',
      aliases: ['guild', 'serverinfo'],
      category: 'general',
      children: [new StaffSubcommand(client)],
    });
  }

  async execute(context) {
    const guild = context.message.guild;
    const guildOwner = guild.owner ? guild.owner.user : await this.client.fetchUser(guild.ownerID);

    const channels = [
      `**${context.message.guild.channels.filter(c => c.type === 'text').size}** ${context.__('channel.type.text')}`,
      `**${context.message.guild.channels.filter(c => c.type === 'voice').size}** ${context.__('channel.type.voice')}`,
    ].join(', ');

    const region = guild.region.startsWith('vip-') ? guild.region.substring(4) : guild.region;

    const serverInformation = [
      `${this.dot} ${context.__('server.embed.id')}: **${guild.id}**${guild.verified ? ` ${this.client.constants.emotes.verifiedServer}` : ''}`,
      `${this.dot} ${context.__('server.embed.owner')}: **${guildOwner.username}**#${guildOwner.discriminator} (ID:${guild.ownerID})`,
      `${this.dot} ${context.__('server.embed.region')}: ${this.client.constants.regionFlags[region]} **${context.__(`server.region.${region}`)}${guild.region.startsWith('vip-') ? ' (VIP)' : ''}**`,
      `${this.dot} ${context.__('server.embed.channels')}: ${channels}`,
      `${this.dot} ${context.__('server.embed.members')}: **${guild.memberCount}**`,
      `${this.dot} ${context.__('server.embed.verificationLevel')}: **${context.__(`server.verificationLevel.${guild.verificationLevel}`)}**`,
      `${this.dot} ${context.__('server.embed.explicitContentFilter')}: **${context.__(`server.explicitContentFilter.${guild.explicitContentFilter}`)}**`,
      `${this.dot} ${context.__('server.embed.defaultMessageNotifications')}: **${context.__(`server.defaultMessageNotifications.${guild.defaultMessageNotifications}`)}**`,
      `${this.dot} ${context.__('server.embed.creation')}: **${context.formatDate(guild.createdTimestamp)}**`,
    ].join('\n');

    const embed = new RichEmbed()
      .setDescription(serverInformation)
      .setThumbnail(guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : undefined)
      .setImage(guild.splash ? `https://cdn.discordapp.com/splashes/${invite.guild.id}/${invite.guild.splash}.png?size=512` : undefined);

    context.reply(
      context.__('server.title', {
        name: guild.name,
      }),
      { embed },
    );
  }
}

class StaffSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'staff',
      aliases: ['mods', 'admins'],
      category: 'general',
    });
  }

  async execute(context) {
    const staff = context.message.guild.members
      .filter(m =>
        !m.user.bot &&
        m.user.presence.status !== 'offline' &&
        (m.permissions.has('MANAGE_GUILD') || m.permissions.has('KICK_MEMBERS'))
      )
      .map(m => ({ username: m.user.username, discrim: m.user.discriminator, status: m.user.presence.status, type: (m.permissions.has('MANAGE_GUILD') ? 'admin' : 'mod') }))
      .sort((a, b) => {
        if (a.status === b.status) {
          if (a.type === b.type) return a.username.toLowerCase().localeCompare(b.username.toLowerCase());
          return a.type.localeCompare(b.type);
        }
        return this.statusOrder[a.status].localeCompare(this.statusOrder[b.status]);
      });

    const embed = new RichEmbed()
      .setDescription(staff.map(m => `${this.client.constants.status[m.status]} **${m.username}**#${m.discrim} (\`${m.type.toUpperCase()}\`)`).join('\n'));

    context.reply(
      context.__('server.staff.title', { name: context.message.guild.name }),
      { embed },
    );
  }

  get statusOrder() {
    return ({
      'online': 'a',
      'idle': 'b',
      'dnd': 'c',
    });
  }
}

module.exports = ServerCommand;
