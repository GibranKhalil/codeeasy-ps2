import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { Interactions } from '@/data/@types/interactions.type';
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

  async addInteraction(pid: string, interaction: { type: keyof Interactions }) {
    const url = this.urlBuilder.buildUrl({
      subEndpoint: `/${pid}/interact`,
    });
    return this.executeRequest<void>(
      'patch',
      url,
      {},
      { type: interaction.type },
    );
  }
}
export const snippetService = new SnippetsService('/snippet');
