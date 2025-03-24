import { Game } from '../../games/entities/game.entity';
import { Snippet } from '../../snippet/entities/snippet.entity';
import { Tutorial } from '../../tutorials/entities/tutorial.entity';

export type SubmissionType = 'snippet' | 'tutorial' | 'game';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export class Submission {
  id!: number;
  type!: SubmissionType;
  status!: SubmissionStatus;
  comment!: string;
  submittedAt!: Date;
  snippet?: Snippet;
  tutorial?: Tutorial;
  game?: Game;
}
