import { IsString, IsNumber, IsPositive, IsIn } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  title: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsIn(['income', 'expense'])
  type: string;

  @IsNumber()
  @IsPositive()
  userId: number;

  @IsNumber()
  @IsPositive()
  categoryId: number;
}

