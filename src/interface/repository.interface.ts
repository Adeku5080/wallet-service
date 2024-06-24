import { RegisterBody } from "../types/register-body";
import { User } from "../types/user-type";

export interface Repository {
  findBy(params: FindByParams): User;

  create(data: RegisterBody): any;
  //   update(id:string,data:updatUserDto):User
  delete(id: string): any;
  findAll(): any;
}

export interface FindByParams {
  id?: number;
  userId?: number;
  email?: string;
}