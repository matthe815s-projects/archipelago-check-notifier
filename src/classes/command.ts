import { ApplicationCommandOption, Client, CommandInteraction } from 'discord.js'

export default class Command {
  name: string
  options: ApplicationCommandOption[]
  client: Client

  execute (interaction: CommandInteraction) {
    console.log('Command executed')
  }
}
