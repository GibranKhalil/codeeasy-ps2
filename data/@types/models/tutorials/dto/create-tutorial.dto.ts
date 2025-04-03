import { User } from '../../users/entities/user.entity';

export class CreateTutorialDto {
  title!: string;
  excerpt!: string;
  readTime!: number;
  tags!: string[];
  content!: string;
  creator!: User;
  coverImage_url!: string;
}
