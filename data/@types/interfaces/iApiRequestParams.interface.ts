/**
 * Interface que define os parâmetros comuns para operações CRUD.
 * Inclui opções como autenticação, sub-endpoints, parâmetros de query e sinal para cancelamento de requisições.
 */
export interface IApiRequestParams {
  /**
   * Indica se a requisição requer autenticação.
   * @type {boolean}
   * @example
   * const options: CRUDParams = { requiresAuth: true };
   */
  requiresAuth?: boolean;

  /**
   * Um sub-endpoint para ser adicionado à URL base.
   * @type {string}
   * @example
   * const options: CRUDParams = { subEndpoint: '/profile' };
   */
  subEndpoint?: string;

  /**
   * Parâmetros de query para serem adicionados à URL.
   * @type {Record<string, any>}
   * @example
   * const options: CRUDParams = { params: { page: 1, limit: 10 } };
   */
  params?: Record<string, any>;

  /**
   * Sinal para cancelamento de requisições (usado com AbortController).
   * @type {AbortSignal}
   * @example
   * const controller = new AbortController();
   * const options: CRUDParams = { signal: controller.signal };
   */
  signal?: AbortSignal;

  /**
   * Headers personalizados que podem ser adicionados à requisição.
   * Útil para incluir cabeçalhos específicos, como chaves de API ou informações adicionais de autenticação.
   *
   * @example
   * const options = {
   *   customHeaders: {
   *     'X-Custom-Header': 'ValorPersonalizado',
   *     'Authorization': 'Bearer token_aqui'
   *   }
   * };
   */
  customHeaders?: Record<string, string>;

  /**
   * Define o tipo da resposta esperada na requisição.
   *
   * O `responseType` informa ao Axios como interpretar a resposta do servidor.
   * Pode ser útil para manipular diferentes formatos de dados, como JSON, texto ou arquivos binários.
   *
   * Valores possíveis:
   * - `"json"` (padrão) - A resposta será automaticamente convertida para um objeto JavaScript.
   * - `"text"` - A resposta será tratada como uma string.
   * - `"blob"` - Indicado para downloads de arquivos, como PDFs ou imagens.
   * - `"arraybuffer"` - Útil para manipulação de dados binários puros.
   * - `"stream"` (Node.js) - A resposta será um fluxo de dados (streams).
   *
   * @see https://axios-http.com/docs/res_schema#responsetype
   *
   * @example
   * // Exemplo de uso para baixar um arquivo como Blob
   * await service.find({
   *   responseType: "blob"
   * });
   *
   * @type {("json" | "text" | "blob" | "arraybuffer" | "stream")}
   */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'stream';
}
