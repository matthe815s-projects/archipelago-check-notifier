import { Client, CommandInteraction, REST, Routes } from 'discord.js'
import MonitorCommand from './commands/monitorcommand'
import UnmonitorCommand from './commands/unmonitorcommand'
import Command from './classes/command'
let restClient: REST

const commandList: Command[] = [
]

function Init (client: Client) {
  commandList.push(new MonitorCommand(client))
  commandList.push(new UnmonitorCommand(client))
  if (client.token == null || client.application == null) return

  restClient = new REST({ version: '10' }).setToken(client.token)
  restClient.put(Routes.applicationCommands(client.application?.id), { body: [] })

  // Register slash commands with Discord.js rest
  restClient.put(Routes.applicationCommands(client.application?.id), { body: GetCommands() })
}

function GetCommands () {
  return commandList.map(command => ({ name: command.name, description: command.name, options: command.options }))
}

function Execute (interaction: CommandInteraction) {
  const command = commandList.find(command => command.name === interaction.commandName)
  if (command == null) return

  command.execute(interaction)
}

const Commands = {
  Init,
  GetCommands,
  Execute
}

export default Commands
