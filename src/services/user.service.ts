// userService.ts

import { Service } from 'typedi';
import { UserRepository } from '../repository/user.repository';
import { LoginBody } from '../types/login-body';
import { RegisterBody } from '../types/register-body';
import * as dotenv from 'dotenv';
import { UserResponseInterface } from '../types/user-response';
import { compare } from 'bcryptjs';
import * as bcrypt from 'bcryptjs';
import { CustomError } from '../errors/custom-error';
import { JWT } from '../helpers/jwt';

dotenv.config();

@Service()
export class UserService {
  constructor(private userRepository: UserRepository, private jwt: JWT) {}

  public async login(body: LoginBody) {
    try {
      const { email, password } = body;
      const user = await this.userRepository.findBy({ email });

      if (!user) {
        throw new CustomError(
          'User with these credentials does not exist',
          400,
        );
      }

      const isPasswordCorrect = await compare(password, user.password);

      if (!isPasswordCorrect) {
        throw new CustomError('Email or Password is incorrect', 400);
      }

      return this.buildUserResponse(user);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async register(body: RegisterBody) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findBy({
        email: body.email,
      });
      if (existingUser) {
        throw new CustomError('Email already exists', 400);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      // Replace the plain text password with the hashed password
      const userData = { ...body, password: hashedPassword };
      const [id] = await this.userRepository.create(userData);
      const user = await this.userRepository.findBy({ id });
      return this.buildUserResponse(user);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // Use the JWT class to generate the token
  private generateJwtToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return this.jwt.generateToken(payload);
  }

  buildUserResponse(user: any): UserResponseInterface {
    return {
      user: {
        ...user,
      },
      token: this.generateJwtToken(user),
    };
  }
}
