import { Interactions } from '@/data/@types/interactions.type';
import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../users/entities/user.entity';
import { eSnippetLanguage } from '@/data/@types/enums/eSnippetLanguage.enum';
import { eContentStatus } from '@/data/@types/enums/eContentStatus.enum';

export class Snippet {
  id!: number;
  pid!: string;
  title!: string;
  description!: string;
  code!: string;
  language!: eSnippetLanguage;
  engine!: string;
  views!: Interactions['views'];
  likes!: Interactions['likes'];
  forks!: Interactions['forks'];
  createdAt!: Date;
  updatedAt!: Date;
  creator!: User;
  lastModifier!: User;
  modifiers!: User[];
  tags!: Tag[];
  status!: eContentStatus;
}
