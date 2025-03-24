import { Interactions } from '@/data/@types/interactions.type';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { eContentStatus } from '@/data/@types/enums/eContentStatus.enum';

export class Game {
  id!: number;
  pid!: string;
  title!: string;
  excerpt!: string;
  version!: string;
  fileSize!: number;
  coverImage_url!: string;
  screenshots!: string[];
  description!: string;
  game_url!: string;
  downloads!: Interactions['downloads'];
  views!: Interactions['views'];
  stars!: Interactions['stars'];
  likes!: Interactions['likes'];
  createdAt!: Date;
  updatedAt!: Date;
  creator!: User;
  category!: Category;
  tags!: Tag[];
  status!: eContentStatus;
}
