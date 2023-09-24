import { EmbedBuilder, Guild, TextBasedChannel, Client as DiscordClient, GuildChannel } from 'discord.js'
import { Client, CollectJSONPacket, HintJSONPacket, ItemSendJSONPacket, PrintJSONPacket, SERVER_PACKET_TYPE, SlotData } from 'archipelago.js'
import MonitorData from './monitordata'
import RandomHelper from '../utils/randohelper'

export default class Monitor {
  client: Client<SlotData>
  channel: TextBasedChannel
  guild: Guild
  data: MonitorData

  queue: string[] = []

  convertData (message: ItemSendJSONPacket | CollectJSONPacket | HintJSONPacket) {
    return message.data.map((slot) => {
      switch (slot.type) {
        case 'player_id':
          return `**${this.client.players.get(parseInt(slot.text))?.name}**`
        case 'item_id':
          return `*${RandomHelper.getItem(this.client, slot.player, parseInt(slot.text))}*`
        case 'location_id':
          return `**${RandomHelper.getLocation(this.client, slot.player, parseInt(slot.text))}**`
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

  constructor (client: Client<SlotData>, monitorData: MonitorData, discordClient: DiscordClient) {
    this.client = client
    this.data = monitorData

    this.channel = discordClient.channels.cache.get(monitorData.channel) as TextBasedChannel
    this.guild = (discordClient.channels.cache.get(monitorData.channel) as GuildChannel).guild

    client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, this.onJSON)
  }

  // When a message is received from the server
  onJSON (packet: PrintJSONPacket) {
    switch (packet.type) {
      case 'Collect':
      case 'ItemSend':
        this.send(this.convertData(packet))
        break
      case 'Hint':
        this.addQueue(this.convertData(packet))
        break
      case 'Join':
        // Overrides for special join messages
        if (packet.tags.includes('Monitor')) return
        if (packet.tags.includes('IgnoreGame')) {
          this.send(`A tracker for **${this.client.players.get(packet.slot)?.name}** has joined the game!`)
          return
        };;

        this.send(`**${this.client.players.get(packet.slot)?.name}** (${this.client.players.get(packet.slot)?.game}) joined the game!`)
        break
      case 'Part':
        this.send(`**${this.client.players.get(packet.slot)?.name}** (${this.client.players.get(packet.slot)?.game}) left the game!`)
        break
    }
  }
}
