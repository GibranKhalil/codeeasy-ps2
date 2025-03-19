'use client';

import Cookies from 'js-cookie';
import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { CreateUserDto } from '@/data/@types/models/users/dto/create-user.dto';

class UserService extends CrudOperations<any, any, any> {
  constructor(endpoint: string) {
    super(endpoint);
  }

  /**
   * Trata erros ocorridos durante operações de serviço.
   *
   * @param {string} operation - A operação que causou o erro.
   * @param {unknown} error - O erro ocorrido.
   * @throws {Error} - Lança um erro com uma mensagem descritiva.
   */
  protected handleServiceError(operation: string, error: unknown): never {
    const newError = new Error(
      `ERRO na operação: ${operation} de usuários! ${error}`,
    );
    throw newError;
  }

  async registerUser(createUserDto: CreateUserDto) {
    const response = await this.create(createUserDto);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.create(
      { email, password },
      { subEndpoint: '/login' },
    );

    console.log(process.env.NODE_ENV === 'production');

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
export const userService = new UserService('/users');
