import { Client, Events, InteractionType } from 'discord.js'
import Commands from './src/commands'
import Database from './src/utils/database'
import Monitors from './src/utils/monitors'
const client = new Client({ intents: ['Guilds'] })
const CONFIG = require('./config/config.json')

client.on(Events.ClientReady, () => {
  console.log('I am ready!')
  Database.migrate()
  Commands.Init(client)

  Database.getConnections().then((results: any) => {
    results.forEach((result: any) => {
      Monitors.make(result, client)
    })
  })
})

client.on(Events.InteractionCreate, async (interaction) => {
  switch (interaction.type) {
    case InteractionType.ApplicationCommandAutocomplete:
      if (interaction.commandName === 'unmonitor') {
        if (interaction.guildId == null) return
        interaction.respond(Monitors.get(interaction.guildId).map(monitor => ({ name: monitor.client.uri || '', value: monitor.client.uri || '' })))
      }
      break
    case InteractionType.ApplicationCommand:
      Commands.Execute(interaction)
      break
  }
})

client.login(CONFIG.token)
