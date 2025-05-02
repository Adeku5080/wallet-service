import { Account } from '../types/acount-type';
import { RegisterBody } from '../types/register-body';
import { User } from '../types/user-type';

export interface Repository {
  findBy(params: FindByParams): any;

  create(data: RegisterBody): any;
  //   update(id:string,data:updatUserDto):User
  delete(params: DeleteByParams): any;
  findAll(params: FindByParams): any;
}

export interface FindByParams {
  id?: number;
  userId?: number;
  email?: string;
}

export interface DeleteByParams {
  id?: number;
  userId?: number;
}
