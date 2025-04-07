import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { Interactions } from '@/data/@types/interactions.type';
import type { IPaginatedResult } from '@/data/@types/interfaces/iPaginatedResult.interface';
import type { CreateTutorialDto } from '@/data/@types/models/tutorials/dto/create-tutorial.dto';
import type { Tutorial } from '@/data/@types/models/tutorials/entities/tutorial.entity';
import type { AxiosResponse } from 'axios';

class TutorialsService extends CrudOperations<
  Tutorial,
  AxiosResponse<IPaginatedResult<Tutorial>>,
  CreateTutorialDto
> {
  constructor(endpoint: string) {
    super('Tutoriais', endpoint);
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
export const tutorialsService = new TutorialsService('/tutorials');
