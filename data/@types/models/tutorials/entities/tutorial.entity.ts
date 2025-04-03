import { Interactions } from '@/data/@types/interactions.type';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { eContentStatus } from '@/data/@types/enums/eContentStatus.enum';

export class Tutorial {
  id!: number;
  pid!: string;
  title!: string;
  excerpt!: string;
  readTime!: number;
  coverImage_url!: string;
  content!: string;
  views!: Interactions['views'];
  likes!: Interactions['likes'];
  createdAt!: Date;
  updatedAt!: Date;
  creator!: User;
  category!: Category;
  tags!: string[];
  status!: eContentStatus;
}
