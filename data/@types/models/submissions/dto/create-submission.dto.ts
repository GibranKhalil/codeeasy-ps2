import { User } from '../../users/entities/user.entity';
import {
  SubmissionStatus,
  SubmissionType,
} from '../entities/submission.entity';

export class CreateSubmissionDto {
  type!: SubmissionType;
  snippetId?: string;
  tutorialId?: string;
  gameId?: string;
  comment?: string;
  creator?: User;
  status?: SubmissionStatus;
}
