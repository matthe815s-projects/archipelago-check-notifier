import Command from '../classes/command'
import { ApplicationCommandOption, CommandInteraction } from 'discord.js'

export default class PingCommand extends Command {
  name = 'ping'
  description = 'Test the bot\'s responsiveness by a ping.'

  options: ApplicationCommandOption[] = []

  constructor (client: any) {
    super()
    this.client = client
  }

  execute (interaction: CommandInteraction) {
    interaction.reply({ content: 'Pong!', ephemeral: true })
  }
}
