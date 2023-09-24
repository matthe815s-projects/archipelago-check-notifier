import { Client, Events, InteractionType, TextBasedChannel } from 'discord.js'
import Commands from './src/commands'
import Database from './src/utils/database'
import Monitors from './src/utils/monitors'
import { Connection } from './src/classes/connection'

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
      Database.createLog(interaction.guildId || '0', interaction.user.id, `Executed command ${interaction.commandName}`)
      break
  }
})

client.on(Events.GuildCreate, async (guild) => {
  // Add the guild to the database
  await Database.createLog(guild.id, '0', 'Added to guild')

  // Document to the logs channel
  const channel = client.channels.cache.get(CONFIG.logs.channel) as TextBasedChannel
  channel.send(`Added to guild ${guild.name}`)
})

client.on(Events.GuildDelete, async (guild) => {
  // Remove the guild from the database
  await Database.createLog(guild.id, '0', 'Removed from guild')
})

client.login(CONFIG.token)
