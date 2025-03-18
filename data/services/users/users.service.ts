import { CrudOperations } from "@/data/@types/abtractModels/CrudOperations.model";

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
    const newError = new Error(`ERRO na operação: ${operation} de usuários! ${error}`);
    throw newError;
  }
}

export const userService = new UserService('/users');