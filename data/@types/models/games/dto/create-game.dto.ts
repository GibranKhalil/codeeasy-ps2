import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../users/entities/user.entity';

export class CreateGameDto {
  title!: string;
  excerpt!: string;
  version!: string;
  fileSize!: number;
  creator!: User;
  category!: Category;
  tags?: Tag[];
  coverImage_url!: string;
  screenshots!: string[];
  game_url!: string;
  description!: string;
}
