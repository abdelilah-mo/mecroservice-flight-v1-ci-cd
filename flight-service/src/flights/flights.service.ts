import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class FlightsService {

  private pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
async onModuleInit() {
  await this.pool.query(`
    CREATE TABLE IF NOT EXISTS flights (
      id SERIAL PRIMARY KEY,
      flight_number VARCHAR(50) UNIQUE,
      departure VARCHAR(100),
      arrival VARCHAR(100),
      price NUMERIC
    );
  `);
}

  async create(flight: any) {
    const result = await this.pool.query(
      'INSERT INTO flights (flight_number, departure, arrival, price) VALUES ($1,$2,$3,$4) RETURNING *',
      [flight.flight_number, flight.departure, flight.arrival, flight.price]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM flights');
    return result.rows;
  }
  async findOne(id: number) {
  const result = await this.pool.query(
    'SELECT * FROM flights WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async update(id: number, flight: any) {
  const result = await this.pool.query(
    'UPDATE flights SET flight_number=$1, departure=$2, arrival=$3, price=$4 WHERE id=$5 RETURNING *',
    [flight.flight_number, flight.departure, flight.arrival, flight.price, id]
  );
  return result.rows[0];
}

async remove(id: number) {
  await this.pool.query(
    'DELETE FROM flights WHERE id = $1',
    [id]
  );
  return { message: 'Deleted successfully' };
}

}