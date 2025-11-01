import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
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
      'SELECT * FROM users ORDER BY id DESC',
    );
    return result.rows;
  }

  async createUser(name: string, email: string): Promise<UserRecord> {
    const result = await this.databaseService.query<UserRecord>(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email],
    );
    const [user] = result.rows;

    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }

    return user;
  }
}
