import { ApplicationCommandOption, AutocompleteInteraction, Client, CommandInteraction } from 'discord.js'

export default class Command {
  name: string
  options: ApplicationCommandOption[]
  client: Client

  execute (interaction: CommandInteraction) {
    console.log('Command executed')
  }

  autocomplete (interaction: AutocompleteInteraction) {
    console.log('Command autocompleted')
  }
}
