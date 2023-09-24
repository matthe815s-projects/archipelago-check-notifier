import { Client, Events } from 'discord.js'
import Commands from './src/commands'
import Database from './src/utils/database'
import MonitorCommand from './src/commands/monitorcommand'
const client = new Client({ intents: ['Guilds'] })
const CONFIG = require('./config/config.json')

client.on(Events.ClientReady, () => {
  console.log('I am ready!')
  Database.migrate()
  Commands.Init(client)

  Database.getConnections().then((results: any) => {
    results.forEach((result: any) => {
      new MonitorCommand(client).makeMonitor(result)
    })
  })
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return
  Commands.Execute(interaction)
})

client.login(CONFIG.token)
