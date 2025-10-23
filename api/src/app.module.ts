import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
     isGlobal: true,
    }),
    PrismaModule,     // Prisma service for DB access
    UsersModule,      // User CRUD & authentication logic
    CategoriesModule, TransactionsModule, // Categories for budgeting
    TransactionsModule, // Expense/income tracking
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

