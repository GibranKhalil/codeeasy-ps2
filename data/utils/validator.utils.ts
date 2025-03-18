/**
 * Classe utilitária para validação de dados.
 * Contém métodos estáticos para validar senhas, campos obrigatórios, comprimento de strings, datas e números.
 */
class Validator {
    /**
     * Verifica a força de uma senha com base em critérios como comprimento, uso de maiúsculas/minúsculas,
     * números, caracteres especiais e senhas comuns proibidas.
     *
     * @param {string} password - A senha a ser validada.
     * @returns {Object} - Um objeto contendo:
     *   - `message`: Uma mensagem descrevendo a força da senha e dicas para melhorá-la.
     *   - `status`: Um booleano indicando se a senha é considerada forte o suficiente.
     *
     * @example
     * const result = Validate.checkPasswordStrength('Senha123!');
     * console.log(result.message); // "Super Forte! "
     * console.log(result.status); // true
     */
    static checkPasswordStrength(password: string) {
      // Initialize variables
      let strength = 0;
      let tips = '';
  
      // Check password length
      if (password.length < 8) {
        tips += 'Digite uma senha com mais caracteres. ';
      } else {
        strength += 1;
      }
  
      // Check for mixed case
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength += 1;
      } else {
        tips += 'Use tanto letras maiúsculas quanto minúsculas. ';
      }
  
      // Check for numbers
      if (password.match(/\d/)) {
        strength += 1;
      } else {
        tips += 'Inclua ao meno 1 número. ';
      }
  
      // Check for common passwords
      if (password == 'Longitude753' || password == 'longitude753') {
        return { message: 'Essa senha não, né!?', status: false };
      }
  
      // Check for special characters
      if (password.match(/[^a-zA-Z\d]/)) {
        strength += 1;
      } else {
        tips += 'Inclua ao menos 1 caractere especial. ';
      }
  
      // Return results
      if (strength < 2) {
        return { message: 'Fraco - ' + tips, status: false };
      } else if (strength === 2) {
        return { message: 'Médio - ' + tips, status: false };
      } else if (strength === 3) {
        return { message: 'Forte! ' + tips, status: false };
      } else {
        return { message: 'Super Forte! ' + tips, status: true };
      }
    }
  
    /**
     * Verifica se um valor é definido (não é `undefined` ou `null`).
     *
     * @param {unknown} value - O valor a ser verificado.
     * @returns {boolean} - `true` se o valor for definido, caso contrário `false`.
     *
     * @example
     * const isValid = Validate.required('valor'); // true
     * const isInvalid = Validate.required(null); // false
     */
    static required(value: unknown): boolean {
      return value !== undefined && value !== null;
    }
  
    /**
     * Retorna uma função que verifica se uma string tem um comprimento mínimo.
     *
     * @param {number} length - O comprimento mínimo exigido.
     * @returns {Function} - Uma função que recebe uma string e retorna `true` se o comprimento for maior ou igual ao mínimo.
     *
     * @example
     * const minLength5 = Validate.minLength(5);
     * const isValid = minLength5('abcde'); // true
     * const isInvalid = minLength5('abc'); // false
     */
    static minLength(length: number): Function {
      return (value: string): boolean => value?.length >= length;
    }
  
    /**
     * Retorna uma função que verifica se uma string tem um comprimento máximo.
     *
     * @param {number} length - O comprimento máximo permitido.
     * @returns {Function} - Uma função que recebe uma string e retorna `true` se o comprimento for menor ou igual ao máximo.
     *
     * @example
     * const maxLength5 = Validate.maxLength(5);
     * const isValid = maxLength5('abc'); // true
     * const isInvalid = maxLength5('abcdef'); // false
     */
    static maxLength(length: number): Function {
      return (value: string): boolean => value?.length <= length;
    }
  
    /**
     * Verifica se um valor é uma instância válida de `Date`.
     *
     * @param {unknown} value - O valor a ser verificado.
     * @returns {boolean} - `true` se o valor for uma data válida, caso contrário `false`.
     *
     * @example
     * const isValid = Validate.isDate(new Date()); // true
     * const isInvalid = Validate.isDate('2023-10-01'); // false
     */
    static isDate(value: unknown): boolean {
      return value instanceof Date && !isNaN(value.getTime());
    }
  
    /**
     * Verifica se um valor é um número válido.
     *
     * @param {unknown} value - O valor a ser verificado.
     * @returns {boolean} - `true` se o valor for um número válido, caso contrário `false`.
     *
     * @example
     * const isValid = Validate.isNumber(42); // true
     * const isInvalid = Validate.isNumber('42'); // false
     */
    static isNumber(value: unknown): boolean {
      return typeof value === 'number' && !isNaN(value);
    }
  
    /**
     * Verifica se um valor é zero.
     *
     * @param {number} value - O valor a ser verificado.
     * @returns {boolean} Retorna `true` se o valor for zero, e `false` se o valor **não** for zero.
     *
     * @example
     * // Retorna false, pois 5 não é zero.
     * Validate.notZero(5);
     *
     * @example
     * // Retorna true, pois 0 é zero.
     * Validate.notZero(0);
     *
     */
    static isZero(value: number): boolean {
      return value === 0;
    }
  
    /**
     * Verifica se a string representa um valor monetário no formato brasileiro (R$ 1.000,50).
     *
     * @param {string} value - A string a ser verificada.
     * @returns {boolean} `true` se estiver no formato brasileiro, caso contrário, `false`.
     */
    static isBrazilianCurrency(value: string): boolean {
      return /^R\$\s*\d{1,3}(\.\d{3})*(,\d+)?$/.test(value);
    }
  
    /**
     * Verifica se a string representa um valor monetário no formato americano ($ 1,000.50).
     *
     * @param {string} value - A string a ser verificada.
     * @returns {boolean} `true` se estiver no formato americano, caso contrário, `false`.
     */
    static isUSCurrency(value: string): boolean {
      return /^\$\s*\d{1,3}(,\d{3})*(\.\d+)?$/.test(value);
    }
  }
  
  export default Validator;