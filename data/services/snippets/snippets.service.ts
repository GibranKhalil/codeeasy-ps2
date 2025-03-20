'use client';

import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { CreateSnippetDto } from '@/data/@types/models/snippet/dto/create-snippet.dto';

class SnippetsService extends CrudOperations<any, any, CreateSnippetDto> {
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
      `ERRO na operação: ${operation} de snippets! ${error}`,
    );
    throw newError;
  }
}
export const snippetService = new SnippetsService('/snippet');
