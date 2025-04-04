import { User } from '../../users/entities/user.entity';

export class CreateTutorialDto {
  title!: string;
  excerpt!: string;
  readTime!: number;
  tags!: string[];
  content!: string;
  categoryId!: number;
  coverImage!: File | null;
  creatorId!: number;
}
