import { Client, CommandInteraction, REST, Routes } from 'discord.js'
import TestCommand from './commands/testcommand'
import MonitorCommand from './commands/monitorcommand'
let restClient: REST

const commandList = [
  new TestCommand()
]

function Init (client: Client) {
  commandList.push(new MonitorCommand(client))
  if (client.token == null || client.application == null) return

  restClient = new REST({ version: '10' }).setToken(client.token)
  restClient.put(Routes.applicationCommands(client.application?.id), { body: [] })

  // Register slash commands with Discord.js rest
  restClient.put(Routes.applicationGuildCommands(client.application?.id, '606926504424767488'), { body: GetCommands() })
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
