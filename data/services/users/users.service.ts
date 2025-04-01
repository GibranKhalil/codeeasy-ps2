import Cookies from 'js-cookie';
import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { CreateUserDto } from '@/data/@types/models/users/dto/create-user.dto';
import { User } from '@/data/@types/models/users/entities/user.entity';
import { AddRoleToUserDto } from '@/data/@types/models/users/dto/add-role-to-user.dto';

class UserService extends CrudOperations<
  User,
  any,
  CreateUserDto | AddRoleToUserDto
> {
  constructor(endpoint: string) {
    super('Usuário', endpoint);
  }
}
export const userService = new UserService('/users');
