import { describe, it, expect } from "bun:test";
import { z } from "zod";
import { getSerializableSignedActionSchema, type ISerializableSignedActionData } from "../services/lib/signed-action";

describe("ISerializableSignedActionData type", () => {
  it("should return string for bigint field", () => {
    const schema = z.object({ amount: z.bigint() });
    type Result = ISerializableSignedActionData<typeof schema>;
    const _assert: Result = { amount: "100" };
  });

  it("should return string | undefined for optional bigint", () => {
    const schema = z.object({ amount: z.bigint().optional() });
    type Result = ISerializableSignedActionData<typeof schema>;
    const _assert1: Result = { amount: "100" };
    const _assert2: Result = { amount: undefined };
  });

  it("should return string | null for nullable bigint", () => {
    const schema = z.object({ amount: z.bigint().nullable() });
    type Result = ISerializableSignedActionData<typeof schema>;
    const _assert1: Result = { amount: "100" };
    const _assert2: Result = { amount: null };
  });

  it("should handle nested objects with bigint", () => {
    const schema = z.object({ user: z.object({ balance: z.bigint() }) });
    type Result = ISerializableSignedActionData<typeof schema>;
    const _assert: Result = { user: { balance: "500" } };
  });

  it("should handle arrays with bigint", () => {
    const schema = z.object({ amounts: z.array(z.bigint()) });
    type Result = ISerializableSignedActionData<typeof schema>;
    const _assert: Result = { amounts: ["1", "2", "3"] };
  });
});

describe("getSerializableSignedActionSchema", () => {
  const validAbi = {
    type: "function" as const,
    name: "transfer",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable" as const,
  };

  it("creates schema with simple data schema", () => {
    const dataSchema = z.object({
      to: z.string(),
      amount: z.bigint(),
    });
    const schema = getSerializableSignedActionSchema(dataSchema);

    const result = schema.parse({
      functionName: "transfer",
      functionAbi: validAbi,
      contractAddress: "0x1234567890123456789012345678901234567890",
      chainId: 1,
      evvmId: "123",
      data: {
        to: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        amount: "100",
      },
      args: [],
    });

    expect(result.functionName).toBe("transfer");
    expect(result.data.amount).toBe("100");
  });

  it("transforms bigint to string in data", () => {
    const dataSchema = z.object({
      balance: z.bigint(),
      limit: z.bigint().optional(),
    });
    const schema = getSerializableSignedActionSchema(dataSchema);

    const result = schema.parse({
      functionName: "setBalance",
      functionAbi: validAbi,
      contractAddress: "0x1234567890123456789012345678901234567890",
      chainId: 1,
      evvmId: "456",
      data: {
        balance: "9999999999999999999",
      },
      args: [],
    });

    expect(result.data.balance).toBe("9999999999999999999");
  });

  it("handles nested objects with bigint", () => {
    const dataSchema = z.object({
      user: z.object({
        id: z.string(),
        balance: z.bigint(),
      }),
    });
    const schema = getSerializableSignedActionSchema(dataSchema);

    const result = schema.parse({
      functionName: "updateUser",
      functionAbi: validAbi,
      contractAddress: "0x1234567890123456789012345678901234567890",
      chainId: 1,
      evvmId: "789",
      data: {
        user: {
          id: "user-123",
          balance: "5000",
        },
      },
      args: [],
    });

    expect(result.data.user.balance).toBe("5000");
  });

  it("handles arrays with bigint", () => {
    const dataSchema = z.object({
      amounts: z.array(z.bigint()),
    });
    const schema = getSerializableSignedActionSchema(dataSchema);

    const result = schema.parse({
      functionName: "batchTransfer",
      functionAbi: validAbi,
      contractAddress: "0x1234567890123456789012345678901234567890",
      chainId: 1,
      evvmId: "101",
      data: {
        amounts: ["100", "200", "300"],
      },
      args: [],
    });

    expect(result.data.amounts).toEqual(["100", "200", "300"]);
  });

  it("validates required fields", () => {
    const dataSchema = z.object({ value: z.bigint() });
    const schema = getSerializableSignedActionSchema(dataSchema);

    expect(() =>
      schema.parse({
        functionName: "test",
        functionAbi: validAbi,
        contractAddress: "0x1234567890123456789012345678901234567890",
        chainId: 1,
        evvmId: "1",
        data: {},
        args: [],
      }),
    ).toThrow();
  });

  it("accepts valid HexString for contractAddress", () => {
    const dataSchema = z.object({});
    const schema = getSerializableSignedActionSchema(dataSchema);

    const result = schema.parse({
      functionName: "test",
      functionAbi: validAbi,
      contractAddress: "0xabc",
      chainId: 1,
      evvmId: "1",
      data: {},
      args: [],
    });

    expect(result.contractAddress).toBe("0xabc");
  });

  it("rejects invalid HexString for contractAddress", () => {
    const dataSchema = z.object({});
    const schema = getSerializableSignedActionSchema(dataSchema);

    expect(() =>
      schema.parse({
        functionName: "test",
        functionAbi: validAbi,
        contractAddress: "not-a-hex",
        chainId: 1,
        evvmId: "1",
        data: {},
        args: [],
      }),
    ).toThrow();
  });

  it("handles nullable bigint fields", () => {
    const dataSchema = z.object({
      amount: z.bigint().nullable(),
    });
    const schema = getSerializableSignedActionSchema(dataSchema);

    const result = schema.parse({
      functionName: "test",
      functionAbi: validAbi,
      contractAddress: "0x1234567890123456789012345678901234567890",
      chainId: 1,
      evvmId: "1",
      data: { amount: null },
      args: [],
    });

    expect(result.data.amount).toBe(null);
  });

  it("handles optional bigint fields", () => {
    const dataSchema = z.object({
      amount: z.bigint().optional(),
    });
    const schema = getSerializableSignedActionSchema(dataSchema);

    const result = schema.parse({
      functionName: "test",
      functionAbi: validAbi,
      contractAddress: "0x1234567890123456789012345678901234567890",
      chainId: 1,
      evvmId: "1",
      data: {},
      args: [],
    });

    expect(result.data.amount).toBeUndefined();
  });

  it("accepts event ABI type", () => {
    const dataSchema = z.object({});
    const schema = getSerializableSignedActionSchema(dataSchema);

    const eventAbi = {
      type: "event" as const,
      name: "Transfer",
      inputs: [
        { name: "from", type: "address", indexed: true },
        { name: "to", type: "address", indexed: true },
        { name: "value", type: "uint256" },
      ],
    };

    const result = schema.parse({
      functionName: "Transfer",
      functionAbi: eventAbi,
      contractAddress: "0x1234567890123456789012345678901234567890",
      chainId: 1,
      evvmId: "1",
      data: {},
      args: [],
    });

    expect(result.functionAbi.type).toBe("event");
  });

  it("handles complex mixed data schema", () => {
    const dataSchema = z.object({
      id: z.string(),
      amount: z.bigint(),
      tags: z.array(z.string()),
      metadata: z.object({
        created: z.number(),
        score: z.bigint(),
      }),
      optionalField: z.bigint().optional(),
    });

    const schema = getSerializableSignedActionSchema(dataSchema);

    const result = schema.parse({
      functionName: "complexAction",
      functionAbi: validAbi,
      contractAddress: "0x1234567890123456789012345678901234567890",
      chainId: 1,
      evvmId: "999",
      data: {
        id: "tx-123",
        amount: "1234567890123456789",
        tags: ["tag1", "tag2"],
        metadata: {
          created: 1700000000,
          score: "100",
        },
      },
      args: [],
    });

    expect(result.data).toEqual({
      id: "tx-123",
      amount: "1234567890123456789",
      tags: ["tag1", "tag2"],
      metadata: {
        created: 1700000000,
        score: "100",
      },
    });
  });
});
