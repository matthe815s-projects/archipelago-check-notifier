import Command from '../classes/command'
import { ApplicationCommandOption, ApplicationCommandOptionType, ChannelType, CommandInteraction, TextBasedChannel } from 'discord.js'
import MonitorData from '../classes/monitordata'
import Monitors from '../utils/monitors'
import Database from '../utils/database'

export default class MonitorCommand extends Command {
  name = 'monitor'
  description = 'Start tracking an archipelago session.'

  options: ApplicationCommandOption[] = [
    { type: ApplicationCommandOptionType.String, name: 'host', description: 'The host to use', required: true },
    { type: ApplicationCommandOptionType.Integer, name: 'port', description: 'The port to use', required: true },
    { type: ApplicationCommandOptionType.String, name: 'game', description: 'The game to monitor', required: true },
    { type: ApplicationCommandOptionType.String, name: 'player', description: 'The player to monitor', required: true },
    { type: ApplicationCommandOptionType.Channel, channelTypes: [ChannelType.GuildText], name: 'channel', description: 'The channel to send messages to', required: true }
  ]

  constructor (client: any) {
    super()
    this.client = client
  }

  validate (interaction: CommandInteraction) {
    // test data 2 for proper URL
    const host = interaction.options.data[2].value as string

    // regex for domain or IP address - eg. archipelago.gg
    const hostRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
    if (!hostRegex.test(host)) { interaction.reply('Invalid host name format. Please use domain name (e.g: archipelago.gg)'); return false }

    // test data 4 for proper channel
    const channel = interaction.options.data[4].channel
    if (channel == null) return false

    // Only add to channels in this guild
    if (interaction.guild?.channels.cache.get(channel.id) == null) return false

    return true
  }

  execute (interaction: CommandInteraction) {
    // Validate text input.
    if (!this.validate(interaction)) return

    // Only allow one monitor per host
    if (Monitors.has(`${interaction.options.data[2].value}:${interaction.options.data[3].value}` as string)) {
      return interaction.reply({ content: 'Already monitoring that host!', ephemeral: true })
    }

    const monitorData: MonitorData = {
      game: interaction.options.get('game', true).value as string,
      player: interaction.options.get('player', true).value as string,
      host: interaction.options.get('host', true).value as string,
      port: interaction.options.get('port', true).value as number,
      channel: interaction.options.get('channel', true).channel?.id as string
    }

    // Send a message to the channel to confirm the monitor has been added.
    const textChannel: TextBasedChannel = this.client.channels.cache.get(monitorData.channel) as TextBasedChannel
    textChannel.send('This monitor will now track Archipelago on this channel.')

    // Make the monitor and save it
    Monitors.make(monitorData, this.client).then(() => {
      Database.makeConnection(monitorData)
    })

    interaction.reply({ content: `Now monitoring Archipelago on ${monitorData.host}:${monitorData.port}.`, ephemeral: true })
  }
}
