import Cookies from 'js-cookie';
import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { CreateUserDto } from '@/data/@types/models/users/dto/create-user.dto';
import { User } from '@/data/@types/models/users/entities/user.entity';

class UserService extends CrudOperations<User, any, CreateUserDto> {
  constructor(endpoint: string) {
    super('Usuários', endpoint);
  }
}
export const userService = new UserService('/users');
