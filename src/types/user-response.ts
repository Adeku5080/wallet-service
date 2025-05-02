import { User } from './user-type';

export interface UserResponseInterface {
    user: {
      User:User;
    };
    token: string;
}
