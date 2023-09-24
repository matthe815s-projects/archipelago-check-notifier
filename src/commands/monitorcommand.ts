import Command from '../classes/command'
import { ApplicationCommandOption, ApplicationCommandOptionType, CommandInteraction, TextBasedChannel } from 'discord.js'
import { Client, ConnectionInformation, ITEMS_HANDLING_FLAGS } from 'archipelago.js'
import Monitor from '../classes/monitor'
import Database from '../utils/database'
import MonitorData from '../classes/monitordata'

const monitors: Monitor[] = []

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

  makeMonitor (data: MonitorData) {
    const archi = new Client()
    const connectionInfo: ConnectionInformation = {
      hostname: data.host,
      port: data.port,
      game: data.game,
      name: data.player,
      items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
      tags: ['IgnoreGame', 'Tracker', 'Monitor']
    }

    archi.connect(connectionInfo).then(() => {
      console.log('Connected to Archipelago')
      // If there's no channel just disconnect
      Database.makeConnection(connectionInfo.hostname, connectionInfo.port, connectionInfo.game, connectionInfo.name, data.channel)
      monitors.push(new Monitor(archi, this.client.channels.cache.get(data.channel) as TextBasedChannel))
    })
  }

  execute (interaction: CommandInteraction) {
    if (interaction.options.data[4].channel == null) return

    const monitorData: MonitorData = {
      game: interaction.options.data[0].value as string,
      player: interaction.options.data[1].value as string,
      host: interaction.options.data[2].value as string,
      port: interaction.options.data[3].value as number,
      channel: interaction.options.data[4].channel.id as string
    }

    this.makeMonitor(monitorData)
    interaction.reply({ content: 'Now monitoring your game!', ephemeral: true })
  }
}
