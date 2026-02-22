import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {

  private pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  async onModuleInit() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255)
      );
    `);
  }

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const result = await this.pool.query(
      'INSERT INTO users (email, password) VALUES ($1,$2) RETURNING id,email',
      [email, hashed]
    );

    return result.rows[0];
  }

  async login(email: string, password: string) {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (!result.rows.length) {
      throw new Error('User not found');
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'secret_key',
      { expiresIn: '1h' }
    );

    return { token };
  }
}