import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import type { IPaginatedResult } from '@/data/@types/interfaces/iPaginatedResult.interface';
import type { CreateSnippetDto } from '@/data/@types/models/snippet/dto/create-snippet.dto';
import type { Snippet } from '@/data/@types/models/snippet/entities/snippet.entity';
import type { AxiosResponse } from 'axios';

class SnippetsService extends CrudOperations<
  Snippet,
  AxiosResponse<IPaginatedResult<Snippet>>,
  CreateSnippetDto
> {
  constructor(endpoint: string) {
    super('Snippets', endpoint);
  }
}
export const snippetService = new SnippetsService('/snippet');
