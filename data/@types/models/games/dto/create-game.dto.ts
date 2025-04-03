export class CreateGameDto {
  title!: string;
  excerpt!: string;
  version!: string;
  fileSize!: number;
  creatorId!: number;
  categoryId!: number;
  tags?: string[];
  coverImage!: File | null;
  screenshots!: File[];
  game_url!: string;
  description!: string;
}
