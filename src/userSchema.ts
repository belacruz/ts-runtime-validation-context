import {
  object,
  string,
  number,
  boolean,
  type ShapeToType,
} from './schemaCore.ts';

export const userSchema = {
  id: string(),
  nome: string(),
  preco: number(),
  quantidade: number(),
  descricao: string(),
  internacional: boolean(),
};

export const userSchemaValidation = object(userSchema);

export type User = ShapeToType<typeof userSchema>;
