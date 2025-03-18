import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../users/entities/user.entity';

export class CreateTutorialDto {
  title!: string;
  excerpt!: string;
  readTime!: number;
  tags!: Tag[];
  content!: string;
  creator!: User;
  coverImage_url!: string;
}
