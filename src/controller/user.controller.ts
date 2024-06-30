import {
  Body,
  JsonController,
  Post,
  Res,
  UseBefore,
} from 'routing-controllers';
import { UserService } from '../services/user.service';
import { LoginDto } from '../dto/login-dto';
import { RegisterDto } from '../dto/register-dto';
import { Service } from 'typedi';
import { Response } from 'express';
import { CheckIfUserIsBlacklisted } from '../middlewares/check-if-user-is-blacklisted';

@Service()
@JsonController('/auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @UseBefore(CheckIfUserIsBlacklisted)
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      const data = await this.userService.register(body);

      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const data = await this.userService.login(body);
      //todo: build in service
      return res
        .status(200)
        .json({ status: 'success', message: 'Login successful', data });
    } catch (error) {
      throw error;
    }
  }
}
