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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    data: { name: string; email: string; password: string },
  ): Promise<User> {
    return this.usersService.create(data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.remove(id);
  }
}