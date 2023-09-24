import Command from '../classes/command'
import { ApplicationCommandOption, ApplicationCommandOptionType, ChannelType, CommandInteraction } from 'discord.js'
import MonitorData from '../classes/monitordata'
import Monitors from '../utils/monitors'

export default class MonitorCommand extends Command {
  name = 'monitor'

  options: ApplicationCommandOption[] = [
    { type: ApplicationCommandOptionType.String, name: 'game', description: 'The game to monitor', required: true },
    { type: ApplicationCommandOptionType.String, name: 'player', description: 'The player to monitor', required: true },
    { type: ApplicationCommandOptionType.String, name: 'host', description: 'The host to use', required: true },
    { type: ApplicationCommandOptionType.Integer, name: 'port', description: 'The port to use', required: true },
    { type: ApplicationCommandOptionType.Channel, channelTypes: [ChannelType.GuildText], name: 'channel', description: 'The channel to send messages to', required: true }
  ]

  constructor (client: any) {
    super()
    this.client = client
  }

  validate (interaction: CommandInteraction) {
    // test data 2 for proper URL
    const host = interaction.options.data[2].value as string

    // regex for domain or IP
    const hostRegex = /^(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,}$/i
    if (!hostRegex.test(host)) return false

    // test data 4 for proper channel
    const channel = interaction.options.data[4].channel
    if (channel == null) return false

    // Only add to channels in this guild
    if (interaction.guild?.channels.cache.get(channel.id) == null) return false

    return true
  }

  execute (interaction: CommandInteraction) {
    if (interaction.options.data[4].channel == null) return
    if (!this.validate(interaction)) {
      interaction.reply({ content: 'Invalid input. Please try again.', ephemeral: true })
      return
    }

    // Only allow one monitor per host
    if (Monitors.has(`${interaction.options.data[2].value}:${interaction.options.data[3].value}` as string)) {
      return interaction.reply({ content: 'Already monitoring that host!', ephemeral: true })
    }

    const monitorData: MonitorData = {
      game: interaction.options.data[0].value as string,
      player: interaction.options.data[1].value as string,
      host: interaction.options.data[2].value as string,
      port: interaction.options.data[3].value as number,
      channel: interaction.options.data[4].channel.id as string
    }

    Monitors.make(monitorData, this.client, true)
    interaction.reply({ content: `Now monitoring Archipelago on ${monitorData.host}:${monitorData.port}.`, ephemeral: true })
  }
}
