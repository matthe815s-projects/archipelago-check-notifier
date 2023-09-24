import Command from '../classes/command'
import { ApplicationCommandOption, ApplicationCommandOptionType, CommandInteraction } from 'discord.js'
import Monitors from '../utils/monitors'

export default class UnmonitorCommand extends Command {
  name = 'unmonitor'

  options: ApplicationCommandOption[] = [
    { type: ApplicationCommandOptionType.String, name: 'host', description: 'The host to remove', required: true, autocomplete: true }
  ]

  constructor (client: any) {
    super()
    this.client = client
  }

  execute (interaction: CommandInteraction) {
    Monitors.remove(interaction.options.data[0].value as string)
    interaction.reply({ content: 'Removed monitor!', ephemeral: true })
  }
}
