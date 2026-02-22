import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import axios from 'axios';

@Injectable()
export class BookingsService {

  private pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  async onModuleInit() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        flight_id INTEGER
      );
    `);
  }

  async create(userId: number, flightId: number) {

  const response = await axios.get(
    `http://flight-service:3000/flights/${flightId}`
  );

  if (!response.data) {
    throw new Error('Flight not found');
  }

  const result = await this.pool.query(
    'INSERT INTO bookings (user_id, flight_id) VALUES ($1,$2) RETURNING *',
    [userId, flightId]
  );

  return result.rows[0];
}
}


