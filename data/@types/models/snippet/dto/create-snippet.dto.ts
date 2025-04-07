import { eSnippetLanguage } from '@/data/@types/enums/eSnippetLanguage.enum';

export class CreateSnippetDto {
  title!: string;
  description!: string;
  code!: string;
  language!: eSnippetLanguage;
  creatorId!: number;
  engine?: string;
  tags!: string;
}
