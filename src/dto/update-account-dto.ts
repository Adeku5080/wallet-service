import { IsNotEmpty, IsNumber, IsOptional, IsString, isNotEmpty } from 'class-validator';

export class updateAccountDto {
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  bankName: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  accountNo: number;
}
