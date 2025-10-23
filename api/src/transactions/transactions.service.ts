import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      include: {
        category: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { category: true, user: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async create(data: {
    title: string;
    amount: number;
    type: string;
    userId: number;
    categoryId?: number;
  }): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  async update(id: number, data: Partial<Transaction>): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data,
      include: { category: true, user: true },
    });
  }

  async remove(id: number): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}