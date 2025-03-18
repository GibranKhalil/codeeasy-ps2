"use client"

import Cookies from 'js-cookie';
import { HttpClient } from "@/data/config/httpClient.config";
import { ICrudOperations } from "../interfaces/iCrudOperations.interface";
import UrlBuilder from "@/data/utils/urlBuilder.utils";
import Validator from "@/data/utils/validator.utils";
import Parser from "@/data/utils/parser.utils";
import { IApiRequestParams } from "../interfaces/iApiRequestParams.interface";
import { AxiosRequestConfig } from "axios";

/**
 * Classe abstrata que implementa operações CRUD genéricas.
 * Fornece métodos para buscar, criar, atualizar e deletar recursos, além de validação e tratamento de erros.
 *
 * @template FIND - O tipo de dado retornado ao buscar um único recurso.
 * @template FINDALL - O tipo de dado retornado ao buscar todos os recursos.
 * @template CREATE - O tipo de dado usado para criar ou atualizar um recurso.
 */
export abstract class CrudOperations<FIND, FINDALL, CREATE> implements ICrudOperations<FIND, FINDALL, CREATE> {
  private readonly httpClient: HttpClient;
  protected readonly urlBuilder: UrlBuilder;
  protected readonly validator: Validator;
  protected readonly parser: Parser;

  /**
   * Cria uma instância de `CRUDService`.
   *
   * @param {string} endPoint - O endpoint principal para as operações CRUD.
   * @param {string} [baseUrl] - A URL base da API (opcional, padrão é process.env.NEXT_PUBLIC_ENDPOINT).
   */
  constructor(
    protected readonly endPoint: string, 
    protected readonly baseUrl: string = process.env.NEXT_PUBLIC_ENDPOINT as string,
    protected readonly tokenCookieName: string = 'token') {
    this.httpClient = new HttpClient();
    this.urlBuilder = new UrlBuilder(this.baseUrl, this.endPoint);
    this.validator = new Validator();
    this.parser = new Parser();
  }

  /**
   * Busca todos os recursos.
   *
   * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
   * @returns {Promise<FINDALL>} - Uma promessa que resolve com a lista de recursos.
   *
   * @example
   * const resources = await service.find({ params: { page: 1, limit: 10 } });
   */
  async find(options?: IApiRequestParams): Promise<FINDALL> {
    const url = this.urlBuilder.buildUrl(options);
    return this.executeRequest<FINDALL>('get', url, options);
  }

  /**
   * Busca um recurso específico pelo ID.
   *
   * @param {number} id - O ID do recurso a ser buscado.
   * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
   * @returns {Promise<FIND>} - Uma promessa que resolve com o recurso encontrado.
   *
   * @example
   * const resource = await service.findById(1, { hasAuth: true });
   */
  async findById(id: number, options?: IApiRequestParams): Promise<FIND> {
    const url = this.urlBuilder.buildUrl(options, id);
    return this.executeRequest<FIND>('get', url, options);
  }

  /**
   * Cria um novo recurso.
   *
   * @param {CREATE | FormData} data - Os dados do recurso a ser criado.
   * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
   * @returns {Promise<any>} - Uma promessa que resolve quando o recurso é criado.
   *
   * @example
   * await service.create({ name: 'John Doe' }, { hasAuth: true });
   */
  async create(data: CREATE | FormData, options?: IApiRequestParams): Promise<any> {
    const url = this.urlBuilder.buildUrl(options);
    return this.executeRequest<any>('post', url, options, data);
  }

  /**
   * Atualiza um recurso existente.
   *
   * @param {number} id - O ID do recurso a ser atualizado.
   * @param {Partial<CREATE | FormData>} data - Os dados parciais do recurso a ser atualizado.
   * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
   * @returns {Promise<any>} - Uma promessa que resolve quando o recurso é atualizado.
   *
   * @example
   * await service.update(1, { name: 'Jane Doe' }, { hasAuth: true });
   */
  async update(id: number, data: Partial<CREATE | FormData>, options?: IApiRequestParams): Promise<any> {
    const url = this.urlBuilder.buildUrl(options, id);
    return this.executeRequest<any>('patch', url, options, data);
  }

  /**
   * Exclui um recurso existente.
   *
   * @param {number} id - O ID do recurso a ser excluído.
   * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
   * @returns {Promise<any>} - Uma promessa que resolve quando o recurso é excluído.
   *
   * @example
   * await service.delete(1, { hasAuth: true });
   */
  async delete(id: number, options?: IApiRequestParams): Promise<any> {
    const url = this.urlBuilder.buildUrl(options, id);
    return this.executeRequest<any>('delete', url, options);
  }

  /**
   * Valida a resposta recebida de uma requisição.
   *
   * @template T - O tipo de dado da resposta.
   * @param {T} response - A resposta a ser validada.
   * @returns {boolean} - `true` se a resposta for válida, caso contrário `false`.
   */
  protected validateResponse<T>(response: T): boolean {
    return response !== null && response !== undefined;
  }

  /**
   * Método abstrato para tratamento de erros durante as operações CRUD.
   * Deve ser implementado pelas subclasses para fornecer tratamento específico de erros.
   *
   * @param {string} operation - A operação que causou o erro (ex: "GET", "POST").
   * @param {unknown} error - O erro ocorrido.
   * @throws {Error} - Deve lançar um erro ou tratar o erro de forma apropriada.
   */
  protected abstract handleServiceError(operation: string, error: unknown): never;

  /**
   * Retorna os headers de autenticação para requisições que requerem autenticação.
   *
   * @returns {Record<string, string>} - Os headers de autenticação.
   */
  protected getAuthHeaders(): Record<string, string> {
    const token = this.getTokenFromCookies();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  protected getTokenFromCookies(): string | null {
    if (typeof window !== 'undefined') {
      return Cookies.get(this.tokenCookieName) || null;
    }
    return null;
  }

  /**
   * Executa uma requisição HTTP genérica.
   *
   * @template T - O tipo de dado esperado na resposta.
   * @param {'get' | 'post' | 'patch' | 'delete' | 'put'} method - O método HTTP a ser usado.
   * @param {string} url - A URL da requisição.
   * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
   * @param {unknown} [data] - Os dados a serem enviados no corpo da requisição (para POST/PATCH).
   * @returns {Promise<T>} - Uma promessa que resolve com os dados da resposta.
   * @throws {Error} - Lança um erro se a resposta for inválida ou se ocorrer um erro na requisição.
   */
  protected async executeRequest<T>(method: string, url: string, options?: IApiRequestParams, data?: unknown): Promise<T> {
    try {
      const config = this.buildRequestConfig(options);
      const response = await this.httpClient.request<T>({
        method,
        url,
        data,
        ...config
      });

      if (!this.validateResponse(response)) {
        throw new Error('Resposta com formato inválido');
      }

      return response;
    } catch (error) {
      this.handleServiceError(method.toUpperCase(), error);
    }
  }

  /**
   * Constrói a configuração para uma requisição Axios.
   *
   * @param {IApiRequestParams} [options] - Opções adicionais para a requisição.
   * @returns {AxiosRequestConfig} - A configuração da requisição.
   */
  private buildRequestConfig(options?: IApiRequestParams): AxiosRequestConfig {
    const config: AxiosRequestConfig = {};

    if (options?.requiresAuth) {
      config.headers = { ...config.headers, ...this.getAuthHeaders() };
    }

    if (options?.signal) {
      config.signal = options.signal;
    }

    if (options?.customHeaders) {
      config.headers = { ...config.headers, ...options.customHeaders };
    }

    if (options?.responseType) {
      config.responseType = options.responseType as AxiosRequestConfig['responseType'];
    }

    return config;
  }
}