import Command from '../classes/command'
import { ApplicationCommandOption, ApplicationCommandOptionType, CommandInteraction } from 'discord.js'
import MonitorData from '../classes/monitordata'
import Monitors from '../utils/monitors'
import Database from '../utils/database'

export default class MonitorCommand extends Command {
  name = 'monitor'

  options: ApplicationCommandOption[] = [
    { type: ApplicationCommandOptionType.String, name: 'game', description: 'The game to monitor', required: true },
    { type: ApplicationCommandOptionType.String, name: 'player', description: 'The player to monitor', required: true },
    { type: ApplicationCommandOptionType.String, name: 'host', description: 'The host to use', required: true },
    { type: ApplicationCommandOptionType.Integer, name: 'port', description: 'The port to use', required: true },
    { type: ApplicationCommandOptionType.Channel, name: 'channel', description: 'The channel to send messages to', required: true }
  ]

  constructor (client: any) {
    super()
    this.client = client
  }

  execute (interaction: CommandInteraction) {
    if (interaction.options.data[4].channel == null) return

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

    Monitors.make(monitorData, this.client)
    Database.makeConnection(monitorData.host, monitorData.port, monitorData.game, monitorData.player, monitorData.channel)
    interaction.reply({ content: 'Now monitoring your game!', ephemeral: true })
  }
}
