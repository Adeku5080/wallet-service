import { Service } from 'typedi';
import { UserRepository } from '../repository/UserRepository';
import { LoginBody } from '../types/login-body';
import { RegisterBody } from '../types/register-body';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UserResponseInterface } from '../types/user-response';
import { compare } from 'bcryptjs';
import * as bcrypt from 'bcryptjs';
import { CustomError } from '../errors/customError';

dotenv.config();

@Service()
export class UserService {
  constructor(private userRepository: UserRepository) {}

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

      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async register(body: RegisterBody) {
    try {
      //check if user already exists
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
      return await this.userRepository.findBy({ id });
    } catch (err) {
      console.log(err);
      throw err;
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
      user:{
        ...user,
        token: this.generateJwtToken(user),
      },
    };
  }
}
