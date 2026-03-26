import { z } from "zod";

export function createSerializableSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodBigInt) {
    return schema.transform((val) => val.toString());
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const newShape: Record<string, z.ZodTypeAny> = {};

    for (const key in shape) {
      newShape[key] = createSerializableSchema(shape[key]);
    }

    return z.object(newShape);
  }

  if (schema instanceof z.ZodArray) {
    return z.array(createSerializableSchema(schema.element));
  }

  if (schema instanceof z.ZodOptional) {
    return createSerializableSchema(schema.unwrap()).optional();
  }

  if (schema instanceof z.ZodNullable) {
    return createSerializableSchema(schema.unwrap()).nullable();
  }

  return schema;
}
