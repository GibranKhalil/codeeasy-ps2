import { eSnippetLanguage } from '@/data/@types/enums/eSnippetLanguage.enum';
import { User } from '../../users/entities/user.entity';

export class CreateSnippetDto {
  title!: string;
  description!: string;
  code!: string;
  language!: eSnippetLanguage;
  creator!: User;
}
