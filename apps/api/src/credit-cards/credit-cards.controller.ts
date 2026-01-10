import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import {
  CreditCardsService,
  type CreateCreditCardDto,
  type CreditCard,
  type CardInstallment,
} from './credit-cards.service';
import { AuthGuard } from '../auth/auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    [key: string]: unknown;
  };
}

@Controller('credit-cards')
@UseGuards(AuthGuard)
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCreditCardDto,
  ): Promise<CreditCard> {
    return this.creditCardsService.create(req.user.sub, dto);
  }

  @Get()
  async getAll(@Req() req: AuthenticatedRequest): Promise<CreditCard[]> {
    return this.creditCardsService.getAll(req.user.sub);
  }

  @Get(':id')
  async getById(@Req() req: AuthenticatedRequest, @Param('id') id: string): Promise<CreditCard> {
    return this.creditCardsService.getById(id, req.user.sub);
  }

  @Put(':id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updates: Partial<CreditCard>,
  ): Promise<CreditCard> {
    return this.creditCardsService.update(id, req.user.sub, updates);
  }

  @Delete(':id')
  async delete(@Req() req: AuthenticatedRequest, @Param('id') id: string): Promise<void> {
    return this.creditCardsService.delete(id);
  }

  @Get(':id/installments')
  async getInstallments(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<CardInstallment[]> {
    return this.creditCardsService.getInstallments(id, req.user.sub);
  }

  @Put(':id/installments/:installmentId/pay')
  async markInstallmentAsPaid(
    @Req() req: AuthenticatedRequest,
    @Param('id') cardId: string,
    @Param('installmentId') installmentId: string,
  ): Promise<CardInstallment> {
    return this.creditCardsService.markInstallmentAsPaid(installmentId, cardId, req.user.sub);
  }
}
