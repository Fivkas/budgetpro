import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsIn, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsIn(['income', 'expense'])
  type?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  userId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoryId?: number;
}

