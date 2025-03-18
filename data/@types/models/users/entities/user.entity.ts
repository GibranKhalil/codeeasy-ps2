import { SocialLinks } from '@/data/@types/socialLinks.type';
import { Role } from '../../roles/entities/role.entity';

export class User {
  id!: number;
  username!: string;
  password!: string;
  email!: string;
  bio!: string;
  links!: SocialLinks;
  lastLoginAt!: Date;
  githubId?: string;
  avatarUrl?: string;
  createdAt!: Date;
  updatedAt!: Date;
  roles!: Role[];
}
