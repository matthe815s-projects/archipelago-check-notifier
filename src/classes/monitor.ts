import { EmbedBuilder, Guild, TextBasedChannel } from 'discord.js'
import { Client, CollectJSONPacket, HintJSONPacket, ItemSendJSONPacket, SERVER_PACKET_TYPE, SlotData } from 'archipelago.js'
import MonitorData from './monitordata'
const dataPackage = require('../../datapackage.json')

export default class Monitor {
  client: Client<SlotData>
  channel: TextBasedChannel
  guild: Guild
  data: MonitorData

  queue: string[] = []

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

  convertData (message: ItemSendJSONPacket | CollectJSONPacket | HintJSONPacket) {
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

  addQueue (message: string) {
    if (this.queue.length === 0) setTimeout(() => this.sendQueue(), 150)
    this.queue.push(message)
  }

  sendQueue () {
    const fields = this.queue.map((message, index) => ({ name: `#${index + 1}`, value: message }))
    this.queue = []
    const message = new EmbedBuilder().setTitle('Hints').addFields(fields).data
    this.channel.send({ embeds: [message] })
  }

  send (message: string) {
    // make an embed for the message
    const embed = new EmbedBuilder().setDescription(message).setTitle('Archipelago')
    this.channel.send({ embeds: [embed.data] })
  }

  constructor (client: Client<SlotData>, monitorData: MonitorData, channel: TextBasedChannel, guild: Guild) {
    this.client = client
    this.channel = channel
    this.guild = guild
    this.data = monitorData

    client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet) => {
      switch (packet.type) {
        case 'Collect':
        case 'ItemSend':
          this.send(this.convertData(packet))
          break
        case 'Hint':
          this.addQueue(this.convertData(packet))
          break
        case 'Join':
          if (packet.tags.includes('Monitor')) {
            return
          }
          if (packet.tags.includes('IgnoreGame')) {
            this.send(`A tracker for **${client.players.get(packet.slot)?.name}** has joined the game!`)
            return
          }
          this.send(`**${client.players.get(packet.slot)?.name}** (${client.players.get(packet.slot)?.game}) joined the game!`)
          break
        case 'Part':
          this.send(`**${client.players.get(packet.slot)?.name}** (${client.players.get(packet.slot)?.game}) left the game!`)
          break
      }
    })
  }
}
