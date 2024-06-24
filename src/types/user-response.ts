import { User } from "./user-type";

export interface UserResponseInterface {
  user: User & { token: string };
}
