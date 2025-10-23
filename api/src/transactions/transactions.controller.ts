import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, Put, ValidationPipe, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(id);
  }

  @Post()
  async create(
   @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    data: CreateTransactionDto,
    ): Promise<Transaction> {
   return this.transactionsService.create(data);
  }


  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
      data: UpdateTransactionDto,
      ): Promise<Transaction> {
    return this.transactionsService.update(id, data);
  }



  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Transaction> {
    return this.transactionsService.remove(id);
  }
}
