const Helper = require('./Helper');
const snekfetch = require('snekfetch');

/**
 * Represents a misc helper.
 * @extends {Helper}
 */
class MiscHelper extends Helper {
  /**
   * Update the guild count on every bot list.
   * @param {String} botID ID of the bot
   * @param {Number} guildID Guild count
   */
  async updateCount(botID, guildID) {
    snekfetch
      .post(`https://ls.terminal.ink/api/v1/bots/${botID}`)
      .set({
        Authorization: this.client.config.api.lsTerminal,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({ server_count: guildID })
      .catch(() => {});

    snekfetch
      .post(`https://discordbots.org/api/bots/${botID}/stats`)
      .set({
        Authorization: this.client.config.api.discordBots,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({ server_count: guildID })
      .catch(() => {});

    snekfetch
      .post(`https://bots.discord.pw/api/bots/${botID}/stats`)
      .set({ Authorization: this.client.config.api.discordPw })
      .send({ server_count: guildID })
      .catch(() => {});
  }
}

module.exports = MiscHelper;
