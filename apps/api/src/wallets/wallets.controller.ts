import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { WalletsService, CreateWalletDto, UpdateWalletDto, Wallet } from './wallets.service';

interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    sub?: string;
    [key: string]: unknown;
  };
}

@Controller('wallets')
@UseGuards(AuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() body: CreateWalletDto): Promise<Wallet> {
    const userId = this.extractUserId(req);
    return this.walletsService.create(userId, body);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest): Promise<Wallet[]> {
    const userId = this.extractUserId(req);
    return this.walletsService.findAll(userId);
  }

  @Get(':walletId')
  findOne(
    @Request() req: AuthenticatedRequest,
    @Param('walletId') walletId: string,
  ): Promise<Wallet> {
    const userId = this.extractUserId(req);
    return this.walletsService.findOne(userId, walletId);
  }

  @Put(':walletId')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('walletId') walletId: string,
    @Body() body: UpdateWalletDto,
  ): Promise<Wallet> {
    const userId = this.extractUserId(req);
    return this.walletsService.update(userId, walletId, body);
  }

  @Delete(':walletId')
  archive(
    @Request() req: AuthenticatedRequest,
    @Param('walletId') walletId: string,
  ): Promise<Wallet> {
    const userId = this.extractUserId(req);
    return this.walletsService.archive(userId, walletId);
  }

  private extractUserId(req: AuthenticatedRequest): string {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User context missing in request');
    }
    return userId;
  }
}
