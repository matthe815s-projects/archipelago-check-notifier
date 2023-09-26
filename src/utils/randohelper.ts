import { Client, GamePackage } from 'archipelago.js'

function getItem (client: Client, playerId: number, itemId: number): string {
  const game: string | undefined = client.players.get(playerId)?.game
  if (game === undefined) return 'Unknown Item'

  const dataPackage: GamePackage | undefined = client.data.package.get(game)
  if (dataPackage === undefined) return 'Unknown Item'

  const item = Object.entries(dataPackage.item_name_to_id).find(([, id]) => id === itemId)
  if (item === undefined) return 'Unknown Item'

  return item[0]
}

function getLocation (client: Client, playerId: number, locationId: number) {
  const game: string | undefined = client.players.get(playerId)?.game
  if (game === undefined) return 'Unknown Location'

  const dataPackage: GamePackage | undefined = client.data.package.get(game)
  if (dataPackage === undefined) return 'Unknown Location'

  const location = Object.entries(dataPackage.location_name_to_id).find(([, id]) => id === locationId)
  if (location === undefined) return 'Unknown Location'

  return location[0] + (`${client.locations.checked[playerId]} / ${client.locations.missing[playerId] + client.locations.checked[playerId]}`)
}

const RandomHelper = {
  getItem,
  getLocation
}

export default RandomHelper
