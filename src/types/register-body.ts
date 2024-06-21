import { User } from "./user-type";

export interface RegisterBody
  extends Pick<User, 'name' | 'password' | 'email'> {}
