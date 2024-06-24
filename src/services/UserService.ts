import { Service } from 'typedi';
import { UserRepository } from '../repository/UserRepository';
import { LoginBody } from '../types/login-body';
import { RegisterBody } from '../types/register-body';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UserResponseInterface } from '../types/user-response';
import { Req } from 'routing-controllers';
import { compare } from 'bcryptjs';
import * as bcrypt from 'bcryptjs';


dotenv.config();

@Service()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async login(body: LoginBody) {
    try {
      const { email, password } = body;
      const user = await this.userRepository.findBy({ email });

      if (!user) {
        console.log('user with the given credentials is not available');
      }

      const isPasswordCorrect = await compare(password, user.password);

      if (!isPasswordCorrect) {
        console.log('invalid credentials');
        return;
      }

      return user;
    } catch (err) {
      console.log(err);
    }
  }

  public async register(body: RegisterBody) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      // Replace the plain text password with the hashed password
      const userData = { ...body, password: hashedPassword };
      const [id] = await this.userRepository.create(userData);
      return await this.userRepository.findBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  private generateJwtToken = (user: any) => {
    const SECRET_KEY: string = process.env.JWT_SECRET as string;
    const options = {
      expiresIn: 3600000,
    };
    const token = jwt.sign(user, SECRET_KEY, options);

    return token;
  };

  buildUserResponse(user: any): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwtToken(user),
      },
    };
  }
}
