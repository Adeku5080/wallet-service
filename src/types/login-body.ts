import { User } from "./user-type";

export interface LoginBody extends Pick<User, 'email' | 'password'> {}
