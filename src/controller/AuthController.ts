import { Body, Controller, JsonController, Post, Req } from 'routing-controllers';
import { UserService } from '../services/UserService';
import { LoginDto } from '../dto/login-dto';
import { RegisterDto } from '../dto/register-dto';

@JsonController('/auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/login')
  async handleLogin(@Body() body: LoginDto) {
    await this.userService.login(body);
  }

  @Post('/register')
  async handleRegister(@Body() body: RegisterDto) {
    await this.userService.register(body);
  }
}
