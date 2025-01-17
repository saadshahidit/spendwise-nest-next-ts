import {
  IsString,
  IsNumber,
  IsPositive,
  IsDateString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsString()
  @MaxLength(255)
  description: string;

  @IsDateString()
  date: string;

  @IsUUID()
  categoryId: string;
}
