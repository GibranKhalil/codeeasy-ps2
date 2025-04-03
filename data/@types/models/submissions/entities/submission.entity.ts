import { eContentStatus } from '@/data/@types/enums/eContentStatus.enum';
import { Game } from '../../games/entities/game.entity';
import { Snippet } from '../../snippet/entities/snippet.entity';
import { Tutorial } from '../../tutorials/entities/tutorial.entity';
import { User } from '../../users/entities/user.entity';

export type SubmissionType = 'snippet' | 'tutorial' | 'game';

export class Submission {
  id!: number;
  type!: SubmissionType;
  title!: string;
  status!: eContentStatus;
  comment!: string;
  submittedAt!: Date;
  resolvedAt!: Date;
  snippet?: Snippet;
  tutorial?: Tutorial;
  game?: Game;
  creator!: User;
}
