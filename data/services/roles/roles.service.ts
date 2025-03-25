import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { Role } from '@/data/@types/models/roles/entities/role.entity';
import { CreateRoleDto } from '@/data/@types/models/roles/dto/create-role.dto';

class RolesService extends CrudOperations<Role, any, CreateRoleDto> {
  constructor(endpoint: string) {
    super('Roles', endpoint);
  }
}
export const rolesService = new RolesService('/roles');
