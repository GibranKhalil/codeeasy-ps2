import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
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
}
export const tutorialsService = new TutorialsService('/tutorials');
