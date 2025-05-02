import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isNotEmpty,
} from 'class-validator';

export class FundAccountDto {
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

  @IsNumber()
  @IsNotEmpty()
  fundingSourceId: number;
}
