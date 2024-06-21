import { Service} from "typedi";
import { UserRepository } from "../repository/UserRepository";
import { LoginBody } from "../types/login-body";
import { RegisterBody } from "../types/register-body";

@Service()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async login(body:LoginBody) {
    await this.userRepository.login(body);
  }

  public async register(body:RegisterBody) {
    await this.userRepository.register(body);
  }
}
