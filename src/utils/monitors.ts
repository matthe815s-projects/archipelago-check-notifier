import MonitorData from '../classes/monitordata'
import { Client, ConnectionInformation, ITEMS_HANDLING_FLAGS } from 'archipelago.js'
import Monitor from '../classes/monitor'
import { Client as DiscordClient } from 'discord.js'
import Database from './database'

const monitors: Monitor[] = []

function make (data: MonitorData, client: DiscordClient): Promise<Monitor> {
  return new Promise<Monitor>((resolve, reject) => {
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
      const monitor = new Monitor(archi, data, client)

      monitors.push(monitor)
      resolve(monitor)
    }).catch((err) => { console.log(err) })
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
