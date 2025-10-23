import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll(@Query('userId', ParseIntPipe) userId: number): Promise<Category[]> {
    return this.categoriesService.findAll(userId);
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    data: { name: string; userId: number },
  ): Promise<Category> {
    return this.categoriesService.create(data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.delete(id);
  }
}
