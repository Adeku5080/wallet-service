import {
  Body,
  Delete,
  Get,
  Res,
  JsonController,
  Param,
  Post,
  Req,
  UseBefore,
} from 'routing-controllers';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Service } from 'typedi';
import { FundingSourceService } from '../services/funding-source.service';
import { CreateFundingSourceDto } from '../dto/create-fundig-source-dto';
import { Request, Response } from 'express';

@Service()
@UseBefore(AuthMiddleware)
@JsonController('/funding-source')
export class FundingSourceController {
  constructor(private fundingSourceService: FundingSourceService) {}

  @Post('/')
  async createFundingSource(
    @Body() body: CreateFundingSourceDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { id: userId } = req.headers;
      const data = await this.fundingSourceService.createFundingSource(
        body,
        Number(userId),
      );
      return res.status(201).json({ data });
    } catch (err) {
      throw err;
    }
  }

  @Get('/')
  async findAllFundingSources(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('Adeku');
      const { id: userId } = req.headers;
      const data = await this.fundingSourceService.listFundingSource(
        Number(userId),
      );
      return res.status(201).json({ data });
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:id')
  async deleteFundingSource(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log('adeku')
      const { id: userId } = req.headers;
      const data = await this.fundingSourceService.deleteFundingSource(id, Number(userId));
      return res.status(204).json({data});
    } catch (err) {
      throw err;
    }
  }
}
