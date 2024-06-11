export namespace Asaas {
  export interface Errors {
    errors: Error[];
  }
  export interface Error {
    code: string;
    description: string;
  }
}

export const IMFO_COMPLETE = 'completa';
export const IMFO_PENDING = 'pendente';
export const IMFO_VALID = 'valida';
export const IMFO_INVALID = 'invalida';
export const IMFO_LIMIT = 'limite';

export class CreateInfoDto {}
