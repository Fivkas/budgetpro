import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Get all users
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Get user by ID
  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }


  // Create a new user
  async create(data: { name: string; email: string; password: string }): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  // Delete a user
  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}

