import { Client, Events, InteractionType } from 'discord.js'
import Commands from './src/commands'
import Database, { Connection } from './src/utils/database'
import Monitors from './src/utils/monitors'

const client = new Client({ intents: ['Guilds'] })
const CONFIG = require('./config/config.json')

client.on(Events.ClientReady, async () => {
  Database.migrate()
  Commands.init(client)

  // Reconnect to all monitors
  const connections: Connection[] = await Database.getConnections()
  connections.forEach((result: any) => Monitors.make(result, client))
})

client.on(Events.InteractionCreate, async (interaction) => {
  switch (interaction.type) {
    case InteractionType.ApplicationCommandAutocomplete: // Auto complete interaction
      Commands.Autocomplete(interaction)
      break
    case InteractionType.ApplicationCommand: // Slash command interaction
      Commands.Execute(interaction)
      break
  }
})

client.login(CONFIG.token)
