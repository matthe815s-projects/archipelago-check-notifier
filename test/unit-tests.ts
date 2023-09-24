import { Client } from 'discord.js'
import Monitors from '../src/utils/monitors'
import MonitorData from '../src/classes/monitordata'

const client = new Client({ intents: ['Guilds'] })
const CONFIG = require('./config/config.json')

const testConnectionDetails: MonitorData = {
  host: 'archipelago.gg',
  port: 54844,
  game: 'Ocarina of Time',
  player: 'Matthew',
  channel: '1155323368342564924'
}

client.login(CONFIG.token)

function start () {
  Monitors.make(testConnectionDetails, client)
}

start()
