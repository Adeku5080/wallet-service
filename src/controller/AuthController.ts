import { Body, JsonController, Post } from 'routing-controllers';
import { UserService } from '../services/UserService';
import { LoginDto } from '../dto/login-dto';
import { RegisterDto } from '../dto/register-dto';
import { Service } from 'typedi';
import { UserResponseInterface } from '../types/user-response';

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/login')
  async handleLogin(@Body() body: LoginDto) {
    try {
      const user = await this.userService.login(body);
      return this.userService.buildUserResponse(user)
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/register')
  async handleRegister(@Body() body: RegisterDto){
    try {
      const user = await this.userService.register(body);
      return this.userService.buildUserResponse(user);
    } catch (error) {
      console.log(error);
    }
  }
}
