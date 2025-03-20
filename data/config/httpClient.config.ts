import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Classe utilitária para realizar requisições HTTP usando o Axios.
 * Configura uma instância do Axios com interceptores para tratamento de respostas e erros.
 */
export class HttpClient {
  private readonly axiosInstance: AxiosInstance;

  /**
   * Cria uma instância de `HttpClient`.
   * Configura o Axios com um timeout padrão e headers de conteúdo JSON.
   * Também configura interceptores para normalizar respostas e erros.
   */
  constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000, // Timeout de 10 segundos
      headers: {
        'Content-Type': 'application/json', // Header padrão para JSON
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptores para a instância do Axios.
   * - Intercepta respostas bem-sucedidas e retorna apenas os dados.
   * - Intercepta erros e os normaliza antes de rejeitar a promessa.
   */
  private setupInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(this.normalizeError(error)),
    );
  }

  /**
   * Normaliza erros recebidos pelo Axios.
   * - Se o erro for uma instância de `AxiosError`, extrai a mensagem de erro da resposta ou usa a mensagem padrão.
   * - Caso contrário, retorna o erro original ou cria um novo erro genérico.
   *
   * @param {unknown} error - O erro a ser normalizado.
   * @returns {Error} - O erro normalizado.
   */
  private normalizeError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      return error;
    }

    return error instanceof Error ? error : new Error('Erro desconhecido');
  }

  /**
   * Realiza uma requisição HTTP usando a instância configurada do Axios.
   *
   * @template T - O tipo esperado dos dados de resposta.
   * @param {AxiosRequestConfig} config - A configuração da requisição (método, URL, dados, etc.).
   * @returns {Promise<T>} - Uma promessa que resolve com os dados da resposta.
   *
   * @example
   * const httpClient = new HttpClient();
   * const response = await httpClient.request<MyResponseType>({
   *   method: 'GET',
   *   url: '/api/data',
   * });
   * console.log(response); // Dados da resposta
   */
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.request<never, T>(config);
  }
}
