import { Service } from 'typedi';
import { FundingSourceController } from '../controller/funding-source.controller';
import { CustomError } from '../errors/custom-error';
import { FundingSourceRepository } from '../repository/funding-source.repository';
import { Card } from '../types/card';

@Service()
export class FundingSourceService {
  constructor(private fundingSourceRepository: FundingSourceRepository) {}
  public async createFundingSource(body: Card, userId: number) {
    const token = this.tokenizeCard();

    if (!token) {
      throw new CustomError('failed to create funding source', 500);
    }
    const fundingSource = {
      userId,
      token,
      active: true,
    };
    const [fundingSourceId] = await this.fundingSourceRepository.create(
      fundingSource,
    );
    return await this.fundingSourceRepository.findBy({ id: fundingSourceId });
  }

  public async listFundingSource(userId: number) {
    return await this.fundingSourceRepository.findAll({ userId });
  }

  public async deleteFundingSource(id: number, userId: number) {
    return await this.fundingSourceRepository.delete({ id, userId });
  }

  private tokenizeCard() {
    return 'token';

    //At this point,we integrate we paystack api
    //they return a token ,which we save in our db
    //and wecan use the token to authorize subsequest charges
  }
}
