import { describe, it, expect } from "bun:test";
import { Core } from "../services";
import { zeroAddress } from "viem";
import { getFakeSigner } from "./fixtures/fakeSigner";

describe("Core service", () => {
  it("pay builds SignedAction for address recipient", async () => {
    const signer = getFakeSigner();
    const core = new Core({
      signer: signer as any,
      address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      chainId: 1,
    });

    const sa = await core.pay({
      toAddress: "0x1111111111111111111111111111111111111111",
      tokenAddress: "0x2222222222222222222222222222222222222222",
      amount: 100n,
      priorityFee: 0n,
      nonce: 1n,
      isAsyncExec: false,
    });

    expect(sa.functionName).toBe("pay");
    expect(sa.data.from).toBe(signer.address);
    expect(sa.data.token).toBe("0x2222222222222222222222222222222222222222");
    expect(sa.data.priorityFee).toBe(0n);
    expect(typeof sa.data.signature).toBe("string");
    expect(sa.data.to_address).toBe(
      "0x1111111111111111111111111111111111111111",
    );
    expect(sa.data.to_identity).toBe("");
  });
  //
  it("pay builds SignedAction for identity recipient", async () => {
    const signer = getFakeSigner();
    const core = new Core({
      signer: signer as any,
      address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      chainId: 1,
    });

    const sa = await core.pay({
      toIdentity: "alice",
      tokenAddress: "0x2222222222222222222222222222222222222222",
      amount: 50n,
      priorityFee: 1n,
      nonce: 2n,
      isAsyncExec: true,
    });

    expect(sa.functionName).toBe("pay");
    expect(sa.data.to_identity).toBe("alice");
    expect(sa.data.to_address).toBe(zeroAddress);
    expect(sa.data.priorityFee).toBe(1n);
    expect(typeof sa.data.signature).toBe("string");
  });

  it("pay throws an error if both toAddress and toIdentity are defined", async () => {
    const signer = getFakeSigner();
    const core = new Core({
      signer: signer as any,
      address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      chainId: 1,
    });

    expect(
      core.pay({
        toAddress: "0x2222222222222222222222222222222222222222",
        toIdentity: "alice",
        tokenAddress: "0x2222222222222222222222222222222222222222",
        amount: 50n,
        priorityFee: 1n,
        nonce: 2n,
        isAsyncExec: true,
      }),
    ).rejects.toThrow(
      /Can\'t call Core.pay with both toAddress and toIdentity/,
    );
  });

  it("dispersePay builds SignedAction with hashed toData mapping", async () => {
    const signer = getFakeSigner();
    const core = new Core({
      signer: signer as any,
      address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      chainId: 1,
    });

    const toData = [
      {
        amount: 1n,
        toAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        toIdentity: undefined,
      },
      {
        amount: 2n,
        toAddress: undefined,
        toIdentity: "id2",
      },
    ];

    const sa = await core.dispersePay({
      toData: toData as any,
      tokenAddress: "0x2222222222222222222222222222222222222222",
      amount: 3n,
      priorityFee: 0n,
      nonce: 5n,
      isAsyncExec: false,
      senderExecutor: "0x3333333333333333333333333333333333333333",
      originExecutor: "0x3333333333333333333333333333333333333333",
    });

    expect(sa.functionName).toBe("dispersePay");
    expect(Array.isArray(sa.data.toData)).toBe(true);
    expect(sa.data.toData.length).toBe(2);
    expect(sa.data.toData[0].amount).toBe(1n);
    expect(sa.data.toData[0].to_address).toBe(
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    );
    expect(sa.data.toData[0].to_identity).toBe("");
    expect(sa.data.token).toBe("0x2222222222222222222222222222222222222222");
    expect(sa.data.priorityFee).toBe(0n);
    expect(sa.data.senderExecutor).toBe("0x3333333333333333333333333333333333333333");
    expect(sa.data.originExecutor).toBe("0x3333333333333333333333333333333333333333");
    expect(typeof sa.data.signature).toBe("string");
  });

  it("dispersePay throws an error if any toData element has both toAddress and toIdentity", async () => {
    const signer = getFakeSigner();
    const core = new Core({
      signer: signer as any,
      address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      chainId: 1,
    });

    const toData = [
      {
        amount: 1n,
        toAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        toIdentity: undefined,
      },
      {
        amount: 2n,
        // deliberate error here
        toAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        toIdentity: "id2",
      },
    ];

    expect(
      core.dispersePay({
        toData: toData as any,
        tokenAddress: "0x2222222222222222222222222222222222222222",
        amount: 3n,
        priorityFee: 0n,
      nonce: 5n,
      isAsyncExec: false,
      senderExecutor: "0x3333333333333333333333333333333333333333",
      originExecutor: "0x3333333333333333333333333333333333333333",
      }),
    ).rejects.toThrow(/both toAddress and toIdentity/);
  });
});
