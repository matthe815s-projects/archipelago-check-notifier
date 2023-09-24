import { CommandInteraction } from 'discord.js'
import Command from '../classes/command'

export default class TestCommand extends Command {
  name = 'test'

  execute (interaction: CommandInteraction) {
    console.log('Test command executed')
    interaction.reply('Test command executed')
  }
}
