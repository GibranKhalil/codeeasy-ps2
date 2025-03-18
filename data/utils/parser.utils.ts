import Validator from "./validator.utils";

/**
 * Classe utilitária para transformar valores em formatos específicos.
 * Contém métodos estáticos para conversão de datas, números, moedas, objetos JSON e arrays.
 */
class Parser {
  /**
   * Converte uma data para uma string no formato ISO (ISO 8601).
   * Retorna `null` se a data for `null` ou `undefined`.
   *
   * @param {Date} date - A data a ser convertida.
   * @returns {string | null} - A data no formato ISO ou `null`.
   *
   * @example
   * const date = new Date();
   * const isoDate = Parser.date(date); // "2023-10-01T12:00:00.000Z"
   */
  static date(date: Date): string | null {
    return date?.toISOString() ?? null;
  }

  /**
   * Converte um número para uma string.
   * Retorna `null` se o número for `null` ou `undefined`.
   *
   * @param {number} num - O número a ser convertido.
   * @returns {string | null} - O número como string ou `null`.
   *
   * @example
   * const num = 42;
   * const numString = Parser.numberToString(num); // "42"
   */
  static numberToString(num: number): string | null {
    return num?.toString() ?? null;
  }
  /**
   * Converte uma string em número. Se a string representar uma medida monetária,
   * ela será convertida corretamente para número.
   *
   * @param {string} value - A string a ser convertida.
   * @returns {number} O número resultante da conversão.
   * @throws {Error} Se a string não puder ser convertida em número.
   */
  static stringToNumber(value: string): number {
    if (!Validator.required(value)) {
      throw new Error('O valor fornecido é inválido.');
    }

    return Parser.parseNumber(value);
  }

  /**
   * Formata um número como moeda no formato brasileiro (BRL).
   * Retorna `null` se o valor for `null`, `undefined` ou zero.
   *
   * @param {number} value - O valor a ser formatado.
   * @returns {string | null} - O valor formatado como moeda ou `null`.
   *
   * @example
   * const value = 1000.50;
   * const currency = Parser.currency(value); // "1.000,50"
   */
  static currency(value: number | string): string | null {
    if (value === null || value === undefined) return null;

    const numericValue = Validator.isNumber(value) ? (value as number) : Parser.stringToNumber(String(value));

    if (!Validator.isNumber(numericValue) || isNaN(numericValue)) return null;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  }

  /**
   * Converte uma string de moeda brasileira para número.
   *
   * @param {string} value - A string em formato "R$ 1.000,50".
   * @returns {number} O valor numérico correspondente.
   */
  static convertBrazilianCurrencyToNumber(value: string): number {
    return parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.'));
  }

  /**
   * Converte uma string de moeda americana para número.
   *
   * @param {string} value - A string em formato "$ 1,000.50".
   * @returns {number} O valor numérico correspondente.
   */
  static convertUSCurrencyToNumber(value: string): number {
    return parseFloat(value.replace('$', '').replace(/,/g, ''));
  }

  /**
   * Converte uma string numérica simples para número.
   *
   * @param {string} value - A string numérica.
   * @returns {number} O valor numérico correspondente.
   * @throws {Error} Se a string não for um número válido.
   */
  static parseNumber(value: string): number {
    const number = parseFloat(value);
    if (isNaN(number)) {
      // throw new Error(`A string "${value}" não pode ser convertida em número.`);
      return 0;
    }
    return number;
  }

  /**
   * Converte um objeto ou valor para uma string JSON.
   * Retorna `null` se o valor for `null` ou `undefined`.
   *
   * @template T - O tipo do objeto ou valor a ser convertido.
   * @param {T} data - O objeto ou valor a ser convertido.
   * @returns {string | null} - A string JSON ou `null`.
   *
   * @example
   * const obj = { name: "John", age: 30 };
   * const json = Parser.jsonStringify(obj); // "{\"name\":\"John\",\"age\":30}"
   */
  static jsonStringify<T>(data: T): string | null {
    if (!data) return null;
    return JSON.stringify(data);
  }

  /**
   * Filtra um array de objetos, mantendo apenas os campos especificados, e converte para uma string JSON.
   * Retorna `null` se o array for `null`, `undefined` ou vazio.
   *
   * @template T - O tipo dos objetos no array.
   * @param {T[]} data - O array de objetos a ser filtrado e convertido.
   * @param {(keyof T)[]} allowedFields - Lista de campos permitidos no resultado.
   * @returns {string | null} - A string JSON do array filtrado ou `null`.
   *
   * @example
   * const data = [
   *   { id: 1, name: "John", age: 30 },
   *   { id: 2, name: "Jane", age: 25 }
   * ];
   * const allowedFields = ['id', 'name'];
   * const json = Parser.arrayToJson(data, allowedFields); // "[{\"id\":1,\"name\":\"John\"},{\"id\":2,\"name\":\"Jane\"}]"
   */
  static arrayToJson<T>(data: T[], allowedFields: (keyof T)[]): string | null {
    if (!data?.length) return null;

    const filteredData = data.map(item =>
      allowedFields.reduce(
        (acc, field) => ({
          ...acc,
          [field]: item[field]
        }),
        {}
      )
    );

    return JSON.stringify(filteredData);
  }
}

export default Parser