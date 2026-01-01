import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
} from '@nestjs/common';
import { UsersService, UserRecord } from './users.service';

interface CreateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAll(): Promise<UserRecord[]> {
    return this.usersService.findAllUsers();
  }

  @Post()
  async create(@Body() body: CreateUserRequest): Promise<UserRecord> {
    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const password = body?.password;

    if (!name || !email || typeof password !== 'string') {
      throw new BadRequestException('Name, email, and password are required');
    }

    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException(
        'Password must include at least one uppercase letter',
      );
    }

    if (!/[0-9]/.test(password)) {
      throw new BadRequestException(
        'Password must include at least one number',
      );
    }

    return this.usersService.createUser(name, email, password);
  }
}
