import { EmbedBuilder, TextBasedChannel } from 'discord.js'
import { Client, CollectJSONPacket, ItemSendJSONPacket, SERVER_PACKET_TYPE, SlotData } from 'archipelago.js'
const dataPackage = require('../../datapackage.json')

export default class Monitor {
  client: Client<SlotData>
  channel: TextBasedChannel

  getItemName (playerId: number, itemId: number) {
    const game = this.client.players.get(playerId)?.game
    if (game == null) return null
    const item = Object.entries(dataPackage.games[game].item_name_to_id).find(([name, id]) => id === itemId)

    return item?.[0]
  }

  getLocationName (playerId: number, locationId: number) {
    const game = this.client.players.get(playerId)?.game

    // This shouldn't ever be the case but just in case.
    if (game == null) return null

    const location = Object.entries(dataPackage.games[game].location_name_to_id).find(([name, id]) => id === locationId)

    return location?.[0]
  }

  convertData (message: ItemSendJSONPacket | CollectJSONPacket) {
    return message.data.map((slot) => {
      switch (slot.type) {
        case 'player_id':
          return `**${this.client.players.get(parseInt(slot.text))?.name}**`
        case 'item_id':
          return `*${this.getItemName(slot.player, parseInt(slot.text))}*`
        case 'location_id':
          return `**${this.getLocationName(slot.player, parseInt(slot.text))}**`
        default:
          return slot.text
      }
    }).join(' ')
  }

  send (message: string, type: string = 'text') {
    // make an embed for the message
    const embed = new EmbedBuilder().setDescription(message).setTitle(type)
    this.channel.send({ embeds: [embed.data] })
  }

  constructor (client: Client<SlotData>, channel: TextBasedChannel) {
    this.client = client
    this.channel = channel

    client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet) => {
      switch (packet.type) {
        case 'Collect':
        case 'ItemSend':
          this.send(this.convertData(packet), 'Item Sent')
          break
        case 'Join':
          if (packet.tags.includes('Monitor')) {
            this.send('This monitor has begun tracking!', 'Monitor')
            return
          }
          if (packet.tags.includes('IgnoreGame')) {
            this.send(`A tracker for **${client.players.get(packet.slot)?.name}** has joined the game!`, 'Tracker Joined')
            return
          }
          this.send(`**${client.players.get(packet.slot)?.name}** (${client.players.get(packet.slot)?.game}) joined the game!`, 'Player Joined')
          break
        case 'Part':
          this.send(`**${client.players.get(packet.slot)?.name}** (${client.players.get(packet.slot)?.game}) left the game!`, 'Player Left')
          break
      }
    })
  }
}
