import { z } from "zod";

function _transform(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodBigInt) {
    return z.string();
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const newShape: Record<string, z.ZodTypeAny> = {};

    for (const key in shape) {
      newShape[key] = _transform(shape[key] as z.ZodTypeAny);
    }

    return z.object(newShape);
  }

  if (schema instanceof z.ZodArray) {
    return z.array(_transform(schema.element as z.ZodTypeAny));
  }

  if (schema instanceof z.ZodOptional) {
    return _transform(schema.unwrap() as z.ZodTypeAny).optional();
  }

  if (schema instanceof z.ZodNullable) {
    return _transform(schema.unwrap() as z.ZodTypeAny).nullable();
  }

  return schema;
}

export type SchemaOutput<T> = T extends z.ZodBigInt
  ? string
  : T extends z.ZodObject<infer S>
    ? {
        [K in keyof S as S[K] extends z.ZodOptional<any>
          ? never
          : K]: SchemaOutput<S[K]>;
      } & {
        [K in keyof S as S[K] extends z.ZodOptional<any>
          ? K
          : never]?: SchemaOutput<
          S[K] extends z.ZodOptional<infer O> ? O : never
        >;
      }
    : T extends z.ZodArray<infer E>
      ? SchemaOutput<E>[]
      : T extends z.ZodOptional<infer O>
        ? SchemaOutput<O> | undefined
        : T extends z.ZodNullable<infer N>
          ? SchemaOutput<N> | null
          : T extends z.ZodTypeAny
            ? z.infer<T>
            : never;

export function createSerializableSchema<T extends z.ZodTypeAny>(
  schema: T,
): z.ZodType<SchemaOutput<T>> {
  return _transform(schema) as z.ZodType<SchemaOutput<T>>;
}

export type InferSerializable<T extends z.ZodTypeAny> = SchemaOutput<T>;

export type SerializeBigInts<T> = T extends bigint
  ? string
  : T extends Array<infer U>
    ? Array<SerializeBigInts<U>>
    : T extends object
      ? { [K in keyof T]: SerializeBigInts<T[K]> }
      : T;
