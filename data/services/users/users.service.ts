'use client';

import Cookies from 'js-cookie';
import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { CreateUserDto } from '@/data/@types/models/users/dto/create-user.dto';
import { AxiosError } from 'axios';

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

  protected handleServiceError(operation: string, error: unknown) {
    const errorMessage = `ERRO na operação: ${operation}!`;

    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || 'Erro inesperado no servidor';

      return {
        success: false,
        status,
        message,
      };
    }

    return {
      success: false,
      status: 500,
      message: errorMessage,
    };
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
