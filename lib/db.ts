import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dev_db',
  user: 'postgres',
  password: '0000',
})

export default pool