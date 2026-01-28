export type ParseResult<T> =
  | { success: true; value: T }
  | { success: false; error: string };

export interface Schema<T> {
  parse(value: unknown): ParseResult<T>;
}

export type ShapeToType<S extends Record<string, Schema<unknown>>> = {
  [K in keyof S]: S[K] extends Schema<infer T> ? T : never;
};

export type ParsedField<T> =
  | { key: string; success: false; error: string }
  | { key: string; success: true; value: T };

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export const string = (): Schema<string> => ({
  parse(value) {
    return typeof value === 'string'
      ? { success: true, value }
      : { success: false, error: 'String Expected' };
  },
});

export const number = (): Schema<number> => ({
  parse(value) {
    return typeof value === 'number'
      ? { success: true, value }
      : { success: false, error: 'Number Expected' };
  },
});

export const boolean = (): Schema<boolean> => ({
  parse(value) {
    return typeof value === 'boolean'
      ? { success: true, value }
      : { success: false, error: 'Boolean Expected' };
  },
});

export function object<S extends Record<string, Schema<unknown>>>(
  shape: S,
): Schema<ShapeToType<S>> {
  return {
    parse(value) {
      if (!isRecord(value)) {
        return { success: false, error: 'Expected object' };
      }

      const parsedFields: ParsedField<unknown>[] = [];

      for (const key in shape) {
        const parsed = shape[key].parse(value[key]);

        if (!parsed.success) {
          parsedFields.push({ key, success: false, error: parsed.error });
          continue;
        }

        parsedFields.push({ key, success: true, value: parsed.value });
      }

      const failed = parsedFields.find((f) => f.success === false);

      if (failed) {
        return { success: false, error: `Invalid field "${failed.key}"` };
      }

      const finalObject = parsedFields.reduce(
        (acc, field) => {
          if (field.success) {
            acc[field.key] = field.value;
          }
          return acc;
        },
        {} as Record<string, unknown>,
      );

      return { success: true, value: finalObject as ShapeToType<S> };
    },
  };
}
