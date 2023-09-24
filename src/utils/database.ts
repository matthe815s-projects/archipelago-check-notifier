import { MysqlError, createConnection } from 'mysql'
const config = require('../../config/config.json')

const connection = createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
})

connection.connect()

async function migrate () {
  await connection.query('CREATE TABLE IF NOT EXISTS connections (id INT AUTO_INCREMENT PRIMARY KEY, host VARCHAR(255), port INT, game VARCHAR(255), player VARCHAR(255), channel VARCHAR(255))')
}

export type Connection = {
  id: number
  host: string
  port: number
  game: string
  player: string
  channel: string
}

function getConnections () {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM connections', (err: MysqlError, results: Connection[]) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

function makeConnection (host: string, port: number, game: string, player: string, channel: string) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO connections (host, port, game, player, channel) VALUES (?, ?, ?, ?, ?)', [host, port, game, player, channel], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

const Database = {
  getConnections,
  makeConnection,
  migrate
}

export default Database
