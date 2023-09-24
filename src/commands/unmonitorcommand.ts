import Command from '../classes/command'
import { ApplicationCommandOption, ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction } from 'discord.js'
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
    // Do not remove if there is no monitor
    if (!Monitors.has(interaction.options.data[0].value as string)) {
      interaction.reply({ content: `There is no active monitor on ${interaction.options.data[0].value}.`, ephemeral: true })
      return
    }

    Monitors.remove(interaction.options.data[0].value as string)
    interaction.reply({ content: `The tracker will no longer track ${interaction.options.data[0].value}.`, ephemeral: true })
  }

  autocomplete (interaction: AutocompleteInteraction): void {
    if (interaction.guildId == null) return
    interaction.respond(Monitors.get(interaction.guildId).map(monitor => ({ name: monitor.client.uri || '', value: monitor.client.uri || '' })))
  }
}
