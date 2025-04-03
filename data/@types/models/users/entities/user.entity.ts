import { Role } from '../../roles/entities/role.entity';

export class User {
  id!: number;
  pid!: string;
  username!: string;
  password!: string;
  email!: string;
  bio!: string;
  linkedin?: string;
  github?: string;
  website?: string;
  lastLoginAt!: Date;
  githubId?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  createdAt!: Date;
  updatedAt!: Date;
  roles!: Role[];
}
