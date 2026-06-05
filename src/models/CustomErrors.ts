/**
 * Exceção lançada quando ocorrem erros na integração ou comunicação com a PokeAPI externa.
 */
export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "APIError";
    // Ajusta o protótipo explicitamente para manter a cadeia de herança em ES5/ES6
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Exceção lançada quando ocorrem erros no carregamento, persistência ou manipulação 
 * do catálogo local (pc_box.json).
 */
export class LocalBoxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalBoxError";
    Object.setPrototypeOf(this, LocalBoxError.prototype);
  }
}
