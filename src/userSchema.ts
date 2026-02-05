import { number, object, string, type ShapeToType } from './SchemaCore.ts';

export const UserShape = {
  id: number(),
  nome: string(),
  aulas: number(),
  cursos: number(),
};

export const UserContentShape = {
  id: number(),
  nome: string(),
  idade: number(),
  aulas: number(),
  cursos: number(),
  preferencias: {
    playback: number(),
    volume: number(),
    qualidade: string(),
  },
};

export type User = ShapeToType<typeof UserShape>;

export const UserShapeValidado = object(UserShape);

export type UserContent = ShapeToType<typeof UserContentShape>;

export const UserContentValidado = object(UserContentShape);
