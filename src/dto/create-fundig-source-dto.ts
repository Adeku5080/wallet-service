import { Card } from "../types/card";

export class CreateFundingSourceDto implements Card {
  cvv: number;
  cardNumber: number;
  expiryMonth: string;
  expiryYear: string;
}
