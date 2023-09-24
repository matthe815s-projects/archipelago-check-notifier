import { MysqlError, createConnection } from 'mysql'
import Monitor from '../classes/monitor'
import { Connection } from '../classes/connection'
import MonitorData from '../classes/monitordata'
const config = require('../../config/config.json')

const connection = createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
})

connection.connect()

/**
 * Migrate the database and ensure all tables exist.
 */
async function migrate (): Promise<void> {
  await connection.query('CREATE TABLE IF NOT EXISTS connections (id INT AUTO_INCREMENT PRIMARY KEY, host VARCHAR(255), port INT, game VARCHAR(255), player VARCHAR(255), channel VARCHAR(255))')
}

function getConnections (): Promise<Connection[]> {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM connections', (err: MysqlError, results: Connection[]) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

/**
 * Store a new multiworld connection in the database.
 * @param data The data to store.
 * @returns
 */
function makeConnection (data: MonitorData): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO connections (host, port, game, player, channel) VALUES (?, ?, ?, ?, ?)', [data.host, data.port, data.game, data.player, data.channel], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

/**
 * Remove a specifed connection from the database.
 * @param monitor
 * @returns
 */
function removeConnection (monitor: Monitor) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM connections WHERE host = ? AND port = ? AND game = ? AND player = ? AND channel = ?', [monitor.data.host, monitor.data.port, monitor.data.game, monitor.data.player, monitor.channel.id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

const Database = {
  getConnections,
  makeConnection,
  removeConnection,
  migrate
}

export default Database
