// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: number): Promise<Category[]> {
    if (userId) {
      return this.prisma.category.findMany({ where: { userId } });
    }
    return this.prisma.category.findMany(); // ✅
  }

  async create(data: { name: string; userId: number }): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async delete(id: number): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }

  async update(id: number, data: { name: string }): Promise<Category> {
  return this.prisma.category.update({
    where: { id },
    data,
  });
}

}
