import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { CreateSubmissionDto } from '@/data/@types/models/submissions/dto/create-submission.dto';
import { Submission } from '@/data/@types/models/submissions/entities/submission.entity';

class SubmissionService extends CrudOperations<
  Submission,
  any,
  CreateSubmissionDto
> {
  constructor(endpoint: string) {
    super('Submissões', endpoint);
  }
}
export const submissionService = new SubmissionService('/submissions');
