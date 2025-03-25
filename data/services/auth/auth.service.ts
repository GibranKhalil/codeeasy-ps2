import Cookies from 'js-cookie';
import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { CreateUserDto } from '@/data/@types/models/users/dto/create-user.dto';

class AuthService extends CrudOperations<any, any, any> {
  constructor(endpoint: string) {
    super('Auth', endpoint);
  }

  async registerUser(createUserDto: CreateUserDto) {
    const response = await this.create(createUserDto);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.create(
      { email, password },
      {
        subEndpoint: '/login',
      },
    );

    const token = response?.data?.access_token;
    if (token) {
      Cookies.set('access_token', token, {
        expires: 1 / 24,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
      });
    }

    return token;
  }
}
export const authService = new AuthService('/users');
