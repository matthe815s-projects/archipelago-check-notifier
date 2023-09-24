import MonitorData from '../classes/monitordata'
import { Client, ConnectionInformation, ITEMS_HANDLING_FLAGS } from 'archipelago.js'
import Monitor from '../classes/monitor'
import { TextBasedChannel, Client as DiscordClient, GuildChannel } from 'discord.js'
import Database from './database'

const monitors: Monitor[] = []

function make (data: MonitorData, client: DiscordClient) {
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
    monitors.push(new Monitor(archi, data, client.channels.cache.get(data.channel) as TextBasedChannel, (client.channels.cache.get(data.channel) as GuildChannel).guild))
  })
}

function remove (host: string) {
  const monitor = monitors.find((monitor) => monitor.client.uri?.includes(host))
  if (monitor == null) return
  monitors.splice(monitors.indexOf(monitor), 1)
  monitor.client.disconnect()
  Database.removeConnection(monitor)
  console.log(`Removed monitor for ${host}`)
}

function has (host: string) {
  return monitors.some((monitor) => monitor.client.uri?.includes(host))
}

function get (guild: string) {
  return monitors.filter((monitor) => monitor.guild.id === guild)
}

const Monitors = {
  make,
  remove,
  has,
  get
}

export default Monitors
