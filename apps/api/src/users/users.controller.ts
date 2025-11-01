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

    if (!name || !email) {
      throw new BadRequestException('Name and email are required');
    }

    return this.usersService.createUser(name, email);
  }
}
