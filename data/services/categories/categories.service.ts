import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import type { IPaginatedResult } from '@/data/@types/interfaces/iPaginatedResult.interface';
import { CreateCategoryDto } from '@/data/@types/models/categories/dto/create-category.dto';
import { Category } from '@/data/@types/models/categories/entities/category.entity';
import type { AxiosResponse } from 'axios';

class CategoriesService extends CrudOperations<
  Category,
  AxiosResponse<IPaginatedResult<Category>>,
  CreateCategoryDto
> {
  constructor(endpoint: string) {
    super('Categorias', endpoint);
  }
}
export const categoriesService = new CategoriesService('/categories');
