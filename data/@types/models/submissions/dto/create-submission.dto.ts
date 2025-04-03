import { eContentStatus } from '@/data/@types/enums/eContentStatus.enum';
import { User } from '../../users/entities/user.entity';
import { SubmissionType } from '../entities/submission.entity';

export class CreateSubmissionDto {
  type!: SubmissionType;
  snippetId?: string;
  tutorialId?: string;
  gameId?: string;
  comment?: string;
  creator?: User;
  status?: eContentStatus;
}
