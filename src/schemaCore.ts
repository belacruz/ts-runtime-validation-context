type ParseResult<T> =
  | { success: true; value: T }
  | { success: false; error: string };

interface Schema<T> {
  parse(value: unknown): ParseResult<T>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
export type ShapeToType<S> =
  S extends Schema<infer T>
    ? T
    : {
        [K in keyof S]: S[K] extends Schema<infer T>
          ? T
          : S[K] extends Record<string, unknown>
            ? ShapeToType<S[K]>
            : never;
      };

type NestedShape = {
  [k: string]: Schema<unknown> | NestedShape;
};

type ParsedField<T> =
  | { key: string; success: true; value: T }
  | { key: string; success: false; error: string };

function isSchema(value: unknown): value is Schema<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'parse' in value &&
    typeof (value as { parse?: unknown }).parse === 'function'
  );
}

export function object<S extends NestedShape>(
  shape: S,
): Schema<ShapeToType<S>> {
  return {
    parse(value) {
      if (!isRecord(value)) {
        return { success: false, error: 'Object Expected' };
      }

      const parsedFields: ParsedField<unknown>[] = [];

      for (const key in shape) {
        const field = shape[key];

        if (isSchema(field)) {
          const parsed = field.parse(value[key]);
          if (!parsed.success) {
            parsedFields.push({ key, success: false, error: parsed.error });
            continue;
          }
          parsedFields.push({ key, success: true, value: parsed.value });
        } else {
          const nestedResult = object(field).parse(value[key]);

          if (!nestedResult.success) {
            parsedFields.push({
              key,
              success: false,
              error: nestedResult.error,
            });
            continue;
          }
          parsedFields.push({ key, success: true, value: nestedResult.value });
        }
      }

      const failed = parsedFields.find((f) => f.success === false);

      if (failed) {
        return { success: false, error: `Invalid field "${failed.key}` };
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

export const string = (): Schema<string> => {
  return {
    parse(value) {
      return typeof value === 'string'
        ? { success: true, value }
        : { success: false, error: 'String Expected' };
    },
  };
};

export const number = (): Schema<number> => {
  return {
    parse(value) {
      return typeof value === 'number'
        ? { success: true, value }
        : { success: false, error: 'Number Expected' };
    },
  };
};
