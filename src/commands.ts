import { AutocompleteInteraction, Client, CommandInteraction, REST, Routes } from 'discord.js'
import MonitorCommand from './commands/monitorcommand'
import UnmonitorCommand from './commands/unmonitorcommand'
import Command from './classes/command'
import PingCommand from './commands/pingcommand'
let restClient: REST

const commandList: Command[] = [
]

const debugCommandList: Command[] = [

]

function Init (client: Client) {
  commandList.push(new PingCommand(client))
  commandList.push(new MonitorCommand(client))
  commandList.push(new UnmonitorCommand(client))

  if (client.token == null || client.application == null) return

  restClient = new REST({ version: '10' }).setToken(client.token)
  restClient.put(Routes.applicationCommands(client.application?.id), { body: [] })

  // Register slash commands with Discord.js rest
  restClient.put(Routes.applicationCommands(client.application?.id), { body: GetCommands() })
  restClient.put(Routes.applicationGuildCommands(client.application?.id, '606926504424767488'), { body: GetDebugCommands() })
}

function GetCommands () {
  return commandList.map(command => ({ name: command.name, description: command.name, options: command.options }))
}

function GetDebugCommands () {
  return debugCommandList.map(command => ({ name: command.name, description: command.name, options: command.options }))
}

function Autocomplete (interaction: AutocompleteInteraction) {
  const command = commandList.find(command => command.name === interaction.commandName)
  if (command == null) return

  command.autocomplete(interaction)
}

function Execute (interaction: CommandInteraction) {
  const command = commandList.find(command => command.name === interaction.commandName)
  if (command == null) return

  command.execute(interaction)
}

const Commands = {
  init: Init,
  GetCommands,
  Execute,
  Autocomplete
}

export default Commands
