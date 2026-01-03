import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';
import * as argon2 from 'argon2';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  created_at?: Date;
  updated_at?: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
  ) {}

  async findAllUsers(): Promise<UserRecord[]> {
    const result = await this.databaseService.query<UserRecord>(
      'SELECT id, name, email, created_at, updated_at FROM users ORDER BY id DESC',
    );
    return result.rows;
  }

  async findOne(email: string): Promise<UserRecord | undefined> {
    const result = await this.databaseService.query<UserRecord>(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1',
      [email],
    );
    return result.rows[0];
  }

  async findOneById(id: string): Promise<UserRecord | undefined> {
    const result = await this.databaseService.query<UserRecord>(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1 LIMIT 1',
      [id],
    );
    return result.rows[0];
  }

  async createUser(name: string, email: string, password: string): Promise<UserRecord> {
    const existing = await this.databaseService.query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [email],
    );

    if (existing.rows.length > 0) {
      throw new ConflictException('Email already exists');
    }

    const id = randomUUID();
    const passwordHash = await argon2.hash(password);
    const result = await this.databaseService.query<UserRecord>(
      `INSERT INTO users (id, name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, created_at, updated_at`,
      [id, name, email, passwordHash],
    );
    const [user] = result.rows;

    if (!user) {
      throw new InternalServerErrorException('Failed to create user.');
    }

    return user;
  }
}
