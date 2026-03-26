import { describe, it, expect } from "bun:test";
import { z } from "zod";
import { createSerializableSchema } from "../utils/zod-schemas";

describe("createSerializableSchema", () => {
  it("transforms standalone ZodBigInt to string", () => {
    const schema = z.bigint();
    const result = createSerializableSchema(schema);
    const parsed = result.parse("100");
    expect(parsed).toBe("100");
  });

  it("transforms ZodBigInt to string in object", () => {
    const schema = z.object({ amount: z.bigint() });
    const result = createSerializableSchema(schema);
    const parsed = result.parse({ amount: "100" });
    expect(parsed.amount).toBe("100");
  });

  it("transforms nested ZodBigInt in objects", () => {
    const schema = z.object({
      user: z.object({ balance: z.bigint() }),
    });
    const result = createSerializableSchema(schema);
    const parsed = result.parse({ user: { balance: "500" } });
    expect(parsed.user!.balance).toBe("500");
  });

  it("handles ZodArray with bigint elements", () => {
    const schema = z.object({ amounts: z.array(z.bigint()) });
    const result = createSerializableSchema(schema);
    const parsed = result.parse({ amounts: ["1", "2", "3"] });
    expect(parsed.amounts).toEqual(["1", "2", "3"]);
  });

  it("handles optional bigint fields", () => {
    const schema = z.object({ amount: z.bigint().optional() });
    const result = createSerializableSchema(schema);
    expect(result.parse({ amount: undefined })).toEqual({ amount: undefined });
    expect(result.parse({})).toEqual({});
  });

  it("handles nullable bigint fields", () => {
    const schema = z.object({ amount: z.bigint().nullable() });
    const result = createSerializableSchema(schema);
    expect(result.parse({ amount: null })).toEqual({ amount: null });
    expect(result.parse({ amount: "10" })).toEqual({ amount: "10" });
  });

  it("handles deeply nested structures", () => {
    const schema = z.object({
      level1: z.object({
        level2: z.object({
          bigintVal: z.bigint(),
        }),
      }),
    });
    const result = createSerializableSchema(schema);
    const parsed = result.parse({
      level1: { level2: { bigintVal: "999" } },
    });
    expect(parsed.level1!.level2!.bigintVal).toBe("999");
  });

  it("handles arrays of objects with bigint", () => {
    const schema = z.array(z.object({ value: z.bigint() }));
    const result = createSerializableSchema(schema);
    const parsed = result.parse([{ value: "1" }, { value: "2" }]);
    expect(parsed).toEqual([{ value: "1" }, { value: "2" }]);
  });

  it("returns unchanged schema for non-bigint types", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
    });
    const result = createSerializableSchema(schema);
    const parsed = result.parse({ name: "John", age: 30, active: true });
    expect(parsed).toEqual({ name: "John", age: 30, active: true });
  });

  it("handles optional with bigint", () => {
    const schema = z.object({
      amount: z.optional(z.bigint()),
    });
    const result = createSerializableSchema(schema);
    expect(result.parse({ amount: "5" })).toEqual({ amount: "5" });
    expect(result.parse({ amount: undefined })).toEqual({ amount: undefined });
  });

  it("handles nullable with bigint", () => {
    const schema = z.object({
      amount: z.nullable(z.bigint()),
    });
    const result = createSerializableSchema(schema);
    expect(result.parse({ amount: null })).toEqual({ amount: null });
    expect(result.parse({ amount: "5" })).toEqual({ amount: "5" });
  });

  it("handles optional and nullable chained", () => {
    const schema = z.object({
      amount: z.bigint().optional().nullable(),
    });
    const result = createSerializableSchema(schema);
    expect(result.parse({ amount: "5" })).toEqual({ amount: "5" });
    expect(result.parse({ amount: null })).toEqual({ amount: null });
    expect(result.parse({ amount: undefined })).toEqual({ amount: undefined });
  });

  it("handles mixed types in object", () => {
    const schema = z.object({
      id: z.string(),
      amount: z.bigint(),
      tags: z.array(z.string()),
      metadata: z.object({
        created: z.number(),
      }),
    });
    const result = createSerializableSchema(schema);
    const parsed = result.parse({
      id: "abc",
      amount: "100",
      tags: ["a", "b"],
      metadata: { created: 123456 },
    });
    expect(parsed).toEqual({
      id: "abc",
      amount: "100",
      tags: ["a", "b"],
      metadata: { created: 123456 },
    });
  });
});
