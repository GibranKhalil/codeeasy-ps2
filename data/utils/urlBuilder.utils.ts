import { IApiRequestParams } from "../@types/interfaces/iApiRequestParams.interface";

/**
 * Classe utilitária para construção de URLs.
 * Permite criar URLs dinâmicas com base em um endpoint base, sub-endpoints, IDs e parâmetros de query.
 */
class UrlBuilder {
  /**
   * Cria uma instância de `UrlBuilder`.
   *
   * @param {string} baseUrl - A URL base (ex: "https://api.example.com").
   * @param {string} endPoint - O endpoint principal (ex: "/users").
   */
  constructor(private readonly baseUrl: string, private readonly endPoint: string) {}

  /**
   * Constrói uma URL completa com base no endpoint, sub-endpoint, ID e parâmetros de query.
   *
   * @param {CRUDParams} [options] - Opções para incluir sub-endpoint e parâmetros de query.
   * @param {number} [id] - O ID do recurso (opcional).
   * @returns {string} - A URL construída.
   *
   * @example
   * const urlBuilder = new UrlBuilder('https://api.example.com', '/users');
   * const url = urlBuilder.buildUrl({ subEndpoint: '/profile', params: { page: '1' } }, 123);
   * console.log(url); // "https://api.example.com/users/profile/123?page=1"
   */
  buildUrl(options?: IApiRequestParams, id?: number): string {
    const base = this.baseUrl + this.endPoint;
    const endpoint = options?.subEndpoint || (id ? `/${id}` : '');
    const url = base + endpoint;

    if (options?.params) {
      return this.addQueryParams(url, options.params);
    }

    return url;
  }

  /**
   * Adiciona parâmetros de query a uma URL.
   *
   * @param {string} url - A URL base.B
   * @param {Record<string, string>} params - Os parâmetros de query a serem adicionados.
   * @returns {string} - A URL com os parâmetros de query.
   *
   * @example
   * const url = 'https://api.example.com/users';
   * const params = { page: '1', limit: '10' };
   * const fullUrl = this.addQueryParams(url, params);
   * console.log(fullUrl); // "https://api.example.com/users?page=1&limit=10"
   */
  private addQueryParams(url: string, params: Record<string, string>): string {
    const queryString = new URLSearchParams(params).toString();
    return `${url}${queryString ? `?${queryString}` : ''}`;
  }
}

export default UrlBuilder