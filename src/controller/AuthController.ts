import {
  Body,
  JsonController,
  Post,
  Res,
  UseBefore,
} from 'routing-controllers';
import { UserService } from '../services/UserService';
import { LoginDto } from '../dto/login-dto';
import { RegisterDto } from '../dto/register-dto';
import { Service } from 'typedi';
import { Response } from 'express';
import { CheckIfUserIsBlacklisted } from '../middlewares/checkIfUserIsBlacklisted';

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const user = await this.userService.login(body);
      const userResponse = this.userService.buildUserResponse(user);
      return res.status(200).json(userResponse);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post('/register')
  @UseBefore(CheckIfUserIsBlacklisted)
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      const user = await this.userService.register(body);
      const userResponse = this.userService.buildUserResponse(user);

      return res.status(201).json(userResponse);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
