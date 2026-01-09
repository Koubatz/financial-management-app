import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import {
  TransactionsService,
  CreateTransactionDto,
  UpdateTransactionDto,
  Transaction,
  TransactionType,
  TransactionStatus,
} from './transactions.service';

interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    sub?: string;
    [key: string]: unknown;
  };
}

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateTransactionDto,
  ): Promise<Transaction> {
    const userId = this.extractUserId(req);
    return this.transactionsService.create(userId, body);
  }

  @Get()
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('walletId') walletId?: string,
    @Query('type') type?: TransactionType,
    @Query('status') status?: TransactionStatus,
  ): Promise<Transaction[]> {
    const userId = this.extractUserId(req);
    return this.transactionsService.findAll(userId, { walletId, type, status });
  }

  @Get('paginated/list')
  findAllPaginated(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('walletId') walletId?: string,
    @Query('type') type?: TransactionType,
    @Query('status') status?: TransactionStatus,
  ): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const userId = this.extractUserId(req);
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.transactionsService.findAllPaginated(userId, pageNum, limitNum, {
      walletId,
      type,
      status,
    });
  }

  @Get(':transactionId')
  findOne(
    @Request() req: AuthenticatedRequest,
    @Param('transactionId') transactionId: string,
  ): Promise<Transaction> {
    const userId = this.extractUserId(req);
    return this.transactionsService.findOne(userId, transactionId);
  }

  @Put(':transactionId')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('transactionId') transactionId: string,
    @Body() body: UpdateTransactionDto,
  ): Promise<Transaction> {
    const userId = this.extractUserId(req);
    return this.transactionsService.update(userId, transactionId, body);
  }

  @Delete(':transactionId')
  delete(
    @Request() req: AuthenticatedRequest,
    @Param('transactionId') transactionId: string,
  ): Promise<Transaction> {
    const userId = this.extractUserId(req);
    return this.transactionsService.delete(userId, transactionId);
  }

  private extractUserId(req: AuthenticatedRequest): string {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User context missing in request');
    }
    return userId;
  }
}
