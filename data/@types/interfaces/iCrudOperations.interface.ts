import { IApiRequestParams } from "./iApiRequestParams.interface";

/**
 * Interface que define um serviço genérico para operações CRUD (Create, Read, Update, Delete).
 * Cada método representa uma operação específica e pode receber opções adicionais via `IApiRequestParams`.
 *
 * @template FIND - O tipo de dado retornado ao buscar um único recurso.
 * @template FINDALL - O tipo de dado retornado ao buscar todos os recursos.
 * @template CREATE - O tipo de dado usado para criar ou atualizar um recurso.
 */
export interface ICrudOperations<FIND, FINDALL, CREATE> {
    /**
     * Busca todos os recursos.
     *
     * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
     * @returns {Promise<FINDALL>} - Uma promessa que resolve com a lista de recursos.
     *
     * @example
     * const service: ICrudOperations<User, User[], CreateUserDTO> = ...;
     * const users = await service.find({ params: { page: 1, limit: 10 } });
     */
    find(options?: IApiRequestParams): Promise<FINDALL>;
  
    /**
     * Busca um recurso específico pelo ID.
     *
     * @param {number} id - O ID do recurso a ser buscado.
     * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
     * @returns {Promise<FIND>} - Uma promessa que resolve com o recurso encontrado.
     *
     * @example
     * const service: ICrudOperations<User, User[], CreateUserDTO> = ...;
     * const user = await service.findById(1, { hasAuth: true });
     */
    findById(id: number, options?: IApiRequestParams): Promise<FIND>;
  
    /**
     * Cria um novo recurso.
     *
     * @param {CREATE | FormData} data - Os dados do recurso a ser criado.
     * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
     * @returns {Promise<any>} - Uma promessa que resolve quando o recurso é criado.
     *
     * @example
     * const service: ICrudOperations<User, User[], CreateUserDTO> = ...;
     * await service.create({ name: 'John Doe' }, { hasAuth: true });
     */
    create(data: CREATE | FormData, options?: IApiRequestParams): Promise<any>;
  
    /**
     * Atualiza um recurso existente.
     *
     * @param {number} id - O ID do recurso a ser atualizado.
     * @param {Partial<CREATE | FormData>} data - Os dados parciais do recurso a ser atualizado.
     * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
     * @returns {Promise<any>} - Uma promessa que resolve quando o recurso é atualizado.
     *
     * @example
     * const service: ICrudOperations<User, User[], CreateUserDTO> = ...;
     * await service.update(1, { name: 'Jane Doe' }, { hasAuth: true });
     */
    update(id: number, data: Partial<CREATE | FormData>, options?: IApiRequestParams): Promise<any>;
  
    /**
     * Exclui um recurso existente.
     *
     * @param {number} id - O ID do recurso a ser excluído.
     * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
     * @returns {Promise<any>} - Uma promessa que resolve quando o recurso é excluído.
     *
     * @example
     * const service: ICrudOperations<User, User[], CreateUserDTO> = ...;
     * await service.delete(1, { hasAuth: true });
     */
    delete(id: number, options?: IApiRequestParams): Promise<any>;
  }