import { Client } from 'discord.js'
import Monitors from '../src/utils/monitors'
import MonitorData from '../src/classes/monitordata'

const client = new Client({ intents: ['Guilds'] })
const CONFIG = require('../config/config.json')

const testConnectionDetails: MonitorData = {
  host: CONFIG.test.host,
  port: CONFIG.test.port,
  game: CONFIG.test.game,
  player: CONFIG.test.player,
  channel: CONFIG.test.channel
}

client.login(CONFIG.token)

async function start () {
  const monitor = await Monitors.make(testConnectionDetails, client)
  monitor.send('Starting Unit Tests...')
  monitor.onJSON({ cmd: 'PrintJSON', data: [{ text: "Matthew (Team #1) tracking Ocarina of Time has joined. Client(0.4.2), ['IgnoreGame', 'Tracker']." }], type: 'Join', team: 0, slot: 1, tags: ['IgnoreGame', 'Tracker'] })
  monitor.onJSON({ cmd: 'PrintJSON', data: [{ text: '4', type: 'player_id' }, { text: ' sent ' }, { text: '66078', player: 1, flags: 0, type: 'item_id' }, { text: ' to ' }, { text: '1', type: 'player_id' }, { text: ' (' }, { text: '42027', player: 4, type: 'location_id' }, { text: ')' }], type: 'ItemSend', receiving: 1, item: { item: 66078, location: 42027, player: 4, flags: 0 } })
  monitor.onJSON({ cmd: 'PrintJSON', data: [{ text: '4', type: 'player_id' }, { text: '\'s ' }, { text: '66078', player: 1, flags: 0, type: 'item_id' }, { text: ' is at ' }, { text: '42027', player: 4, type: 'location_id' }, { text: ' in ' }, { text: '4', type: 'player_id' }, { text: '\'s World' }], type: 'Hint', found: false, receiving: 1, item: { item: 66078, location: 42027, player: 4, flags: 0 } })
  monitor.onJSON({ cmd: 'PrintJSON', data: [{ text: '4', type: 'player_id' }, { text: '\'s ' }, { text: '66078', player: 1, flags: 0, type: 'item_id' }, { text: ' is at ' }, { text: '42027', player: 4, type: 'location_id' }, { text: ' in ' }, { text: '4', type: 'player_id' }, { text: '\'s World' }], type: 'Hint', found: false, receiving: 1, item: { item: 66078, location: 42027, player: 4, flags: 0 } })
  monitor.onJSON({ cmd: 'PrintJSON', data: [{ text: "Matthew (Team #1) tracking Ocarina of Time has joined. Client(0.4.2), ['IgnoreGame', 'Tracker']." }], type: 'Part', team: 0, slot: 1 })
  monitor.client.disconnect()
  process.exit()
}

start()
